import { Box, Button, Checkbox, InputBase, Modal, NavLink, Pill, ScrollArea, Text, Title, UnstyledButton } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { IconCategory, IconColorFilter, IconFilter, IconIcons, IconSearchOff } from "@tabler/icons-react";
import { useEffect, useState } from "preact/hooks";
import { useNavigate } from "react-router-dom";
import SmallChangeHelmet from "../../components/Helmets/SmallChangeHelmet";
import ProductCard from "../../components/ProductCard";
import { getProducts } from "../../lib/database";
import { Product, ProductColor } from "../../lib/database/models";
import LoaderBox, { setDocumentTitle, toTitleCase } from "../../lib/utils";
import { Filter } from "../../lib/utils/filters";
import { convertToKeywords } from "../../lib/utils/search";
import classes from "./index.module.css";

enum PageState {
  Loading,
  Searching,
  Filtering,
  Loaded,
}

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [colors, setColors] = useState<ProductColor[]>([]);

  const [allFilterValues, setAllFilterValues] = useState<Filter["value"][]>([]);

  useEffect(() => {
    if (!products) return;

    setColors([]);
    setAllFilterValues([]);

    products.forEach((product) => {
      product.expand.colors?.forEach((color) => {
        setColors((prev) => {
          if (!prev.every((c) => c.id != color.id)) return prev;
          return [...prev, color];
        });
      });

      product.expand.category?.forEach((category) => {
        setAllFilterValues((prev) => {
          if (!prev.every((c) => c.id != category.id)) return prev;
          return [...prev, category];
        });
      });

      setAllFilterValues((prev) => {
        if (!prev.every((c) => c.id != product.expand.brand.id)) return prev;
        return [...prev, product.expand.brand];
      });
    });

    setAllFilterValues((prev) => [...prev, ...colors]);
  }, [products]);

  const [pageState, setPageState] = useState<PageState>(PageState.Loading);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [modalOpened, setModalOpened] = useState<boolean>(false);
  const isMobile = useMediaQuery("(max-width: 48em)");
  const navigate = useNavigate();

  const [searchedColor, setSearchedColor] = useState<string>("");

  const setSortedProducts = (products: Product[]) => {
    setProducts(
      products
        .filter((product) => !product.tags.includes("out_of_stock"))
        .concat(products.filter((product) => product.tags.includes("out_of_stock"))),
    );
  };

  function searchProducts() {
    setPageState(PageState.Searching);

    const url = new URL(window.location.href);
    const search = url.searchParams.get("search")?.toLowerCase();
    if (!search) return setPageState(PageState.Loaded);

    const keywords = convertToKeywords(search);

    const keywordForColor = keywords.find((keyword) => colors.some((color) => color.name.toLowerCase().includes(keyword)));

    const color = keywordForColor ? colors.find((color) => color.name.toLowerCase().includes(keywordForColor)) : "";

    if (color) setSearchedColor(color.name);

    getProducts().then((products) =>
      setSortedProducts(
        products.filter((product) =>
          keywords.every((keyword) =>
            `${product.name} | ${(product.expand.colors ?? []).map((color) => color.name).join(" ")} | ${product.custom_id} | ${(product.expand.types ?? []).map((type) => type.name).join(" ")} | ${(product.expand.category ?? []).map((category) => category.name).join(" ")} | ${product.expand.brand.name}`
              .toLowerCase()
              .includes(keyword),
          ),
        ),
      ),
    );
    setPageState(PageState.Loaded);
  }

  useEffect(() => {
    setDocumentTitle("Catalog");

    const url = new URL(window.location.href);

    if (url.searchParams.get("search")) return searchProducts();

    if (!url.searchParams.get("filters"))
      getProducts().then((products) => {
        setSortedProducts(products);
        setPageState(PageState.Loaded);
      });
  }, []);

  function filterProducts(newFilters: Filter[], fromFilterList: boolean = true) {
    getProducts().then(async (products) => {
      for (const filter of newFilters) {
        if (filter.type === "color")
          products = products.filter((product) => !!product.expand?.colors?.find((productColor) => productColor.id === filter.value.id));
        if (filter.type === "category")
          products = products.filter((product) => !!product.expand?.category?.find((productCategory) => productCategory.id === filter.value.id));
        if (filter.type === "brand") products = products.filter((product) => product.expand.brand.id === filter.value.id);
      }

      setSortedProducts(products);
      pageState !== PageState.Loaded && setPageState(PageState.Loaded);

      if (fromFilterList && newFilters.length > 0) {
        const filters: Record<string, Filter["value"][]> = {};

        for (const filter of newFilters) {
          if (!filters[filter.type]) filters[filter.type] = [];
          filters[filter.type].push(filter.value);
        }

        let filtersQueryString = "";

        for (const type in filters) {
          filtersQueryString += `${type}:${filters[type].map((filter) => filter.name).join("+")},`;
        }

        filtersQueryString = filtersQueryString.slice(0, -1);

        navigate(`/catalog?filters=${filtersQueryString}`);
      }

      if (fromFilterList && newFilters.length === 0) navigate("/catalog");
    });
  }

  useEffect(() => {
    async function handleHrefChange() {
      setPageState(PageState.Loading);
      const urlSearchParams = new URL(window.location.href).searchParams;
      const filtersParam = urlSearchParams.get("filters");
      const searchParam = urlSearchParams.get("search");

      if (!filtersParam && !searchParam) {
        setPageState(PageState.Loaded);
        setFilters([]);
        filterProducts([], false);
        return;
      }

      if (filtersParam) {
        setPageState(PageState.Filtering);

        const allFilters = filtersParam.split(",");

        const filters: Filter[] = [];

        allFilters.forEach((filter) => {
          const subFilters = filter.split(",");
          subFilters.forEach((subFilter) => {
            const [type, values] = subFilter.split(":");
            values
              .split("+")
              .forEach((value) =>
                filters.push({ type: type as Filter["type"], value: allFilterValues.find((filterValue) => filterValue.id === value)! }),
              );
          });
        });

        setPageState(PageState.Loaded);
        setFilters(filters);
        filterProducts(filters, false);
      }
      if (searchParam) searchProducts();
    }

    handleHrefChange();
  }, [window.location.href]);

  function updateFilters(type: Filter["type"]) {
    return (values: string[]) => {
      const newFilters: Filter[] = [];
      for (const filter of filters) if (filter.type !== type) newFilters.push(filter);

      for (const value of values) newFilters.push({ type, value: allFilterValues.find((filterValue) => filterValue.name === value)! });

      setPageState(PageState.Filtering);
      setFilters(newFilters);
      filterProducts(newFilters);
    };
  }

  const getFilterValues = (type: Filter["type"]) => filters.filter((filter) => filter.type === type).map((value) => value.value.name);

  const [openCategoryFilter, categoryFilter] = useDisclosure(true);
  const [openBrandFilter, brandFilter] = useDisclosure(true);
  const [openColorFilter, colorFilter] = useDisclosure(true);

  function FilterNavBar() {
    return (
      <Box mih={"100%"} w={!isMobile ? 200 : "auto"} style={{ flex: "0.5" }}>
        <NavLink
          label="Categories"
          leftSection={<IconCategory size="1rem" stroke={1.5} />}
          childrenOffset={28}
          opened={openCategoryFilter}
          onClick={categoryFilter.toggle}
        >
          <Checkbox.Group value={getFilterValues("category")} onChange={updateFilters("category")}>
            <ScrollArea.Autosize mah={!isMobile ? 250 : "auto"}>
              {(() => {
                const categories: string[] = [];

                for (const product of products)
                  if (product.expand?.category)
                    for (const category of product.expand.category) if (!categories.includes(category.name)) categories.push(category.name);

                return categories.map((category) => (
                  <Checkbox mb={5} mt={5} label={category.replaceAll("/", " / ")} value={category} key={category} />
                ));
              })()}
            </ScrollArea.Autosize>
          </Checkbox.Group>
        </NavLink>
        <NavLink
          label="Brands"
          leftSection={<IconIcons size="1rem" stroke={1.5} />}
          childrenOffset={28}
          opened={openBrandFilter}
          onClick={brandFilter.toggle}
        >
          <Checkbox.Group value={getFilterValues("brand")} onChange={updateFilters("brand")}>
            <ScrollArea.Autosize mah={!isMobile ? 250 : "auto"}>
              {(() => {
                const brands: string[] = [];

                for (const product of products)
                  if (product.expand?.brand && !brands.includes(product.expand?.brand.name)) brands.push(product.expand?.brand.name);

                return brands.map((brand) => <Checkbox mb={5} mt={5} label={brand} value={brand} key={brand} />);
              })()}
            </ScrollArea.Autosize>
          </Checkbox.Group>
        </NavLink>
        <NavLink
          label="Colors"
          leftSection={<IconColorFilter size="1rem" stroke={1.5} />}
          childrenOffset={28}
          opened={openColorFilter}
          onClick={colorFilter.toggle}
        >
          <Checkbox.Group value={getFilterValues("color")} onChange={updateFilters("color")}>
            <ScrollArea.Autosize mah={!isMobile ? 250 : "auto"}>
              {(() => {
                const colors: string[] = [];

                for (const product of products)
                  if (product.expand?.colors) for (const color of product.expand.colors) if (!colors.includes(color.name)) colors.push(color.name);

                return colors.map((color) => <Checkbox mb={5} mt={5} label={toTitleCase(color)} value={color} key={color} />);
              })()}
            </ScrollArea.Autosize>
          </Checkbox.Group>
        </NavLink>
      </Box>
    );
  }

  if (pageState === PageState.Loading) return <LoaderBox />;

  return (
    <Box className={classes.container}>
      <SmallChangeHelmet title="Catalog" description="Browse through our wide selection of products!" location="catalog" />
      <Modal opened={modalOpened} onClose={() => setModalOpened(false)} title={"Filters"} withCloseButton>
        <FilterNavBar />
      </Modal>
      <Box visibleFrom="xs">
        <FilterNavBar />
      </Box>
      <Box w="80%" display={"flex"} style={{ alignItems: "center", flexDirection: "column" }} mb="5%" hiddenFrom="xs">
        <Title ta="center" order={1} mb="5%">
          Catalog
        </Title>
        <Button leftSection={<IconFilter size="1rem" stroke={1.5} />} variant="light" radius="xl" onClick={() => setModalOpened(true)}>
          Filters
        </Button>
      </Box>
      <Box style={{ flex: "4.5" }}>
        <Box ml="1vw" visibleFrom="xs">
          <Text mb="1vh" c="dimmed">
            Filters:
          </Text>
          <InputBase component="div" multiline>
            <Pill.Group>
              {filters.map((filter) => (
                <Pill
                  key={filter.value}
                  withRemoveButton
                  onRemove={() => {
                    const newFilters: Filter[] = [];
                    for (const f of filters) if (f.value !== filter.value) newFilters.push(f);
                    setFilters(newFilters);
                    filterProducts(newFilters);
                  }}
                >
                  {filter.value}
                </Pill>
              ))}
            </Pill.Group>
          </InputBase>
        </Box>
        {pageState === PageState.Filtering ? (
          <LoaderBox text="Filtering..." />
        ) : pageState === PageState.Searching ? (
          <LoaderBox text="Searching..." />
        ) : products.length === 0 ? (
          <Box display="flex" style={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }} w="100%" h="50vh">
            <IconSearchOff style={{ width: "30%", height: "30%", marginBottom: "1em" }} stroke={1} />
            <Title ta="center" order={1} mb="md">
              No Products Found
            </Title>
            <Text>
              <UnstyledButton
                onClick={() => {
                  getProducts().then(setSortedProducts);
                  setFilters([]);
                }}
                style={{ color: "black", textDecoration: "underline" }}
              >
                Clear
              </UnstyledButton>{" "}
              filters/queries and try again.
            </Text>
          </Box>
        ) : (
          <Box className={classes.cardsBox}>
            {products
              .filter((p) => !p.hidden)
              .map((product) => (
                <ProductCard product={product} key={product.id} isMobile={isMobile} searchedColor={searchedColor} />
              ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
