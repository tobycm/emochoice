import { Box, Button, Checkbox, InputBase, Modal, NavLink, Pill, ScrollArea, Text, Title, UnstyledButton } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { IconCategory, IconColorFilter, IconFilter, IconIcons, IconSearchOff } from "@tabler/icons-react";
import { useEffect, useState } from "preact/hooks";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../components/Card";
import SmallChangeHelmet from "../../components/Helmets/SmallChangeHelmet";
import { getCategory, getColor, getProducts, searchCategory, searchColor } from "../../lib/database";
import { Product } from "../../lib/database/models";
import LoaderBox, { setDocumentTitle, toTitleCase } from "../../lib/utils";
import classes from "./index.module.css";

type FilterTypes = "color" | "category" | "brand";

interface Filter {
  type: FilterTypes;
  value: string;
}

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [modalOpened, setModalOpened] = useState<boolean>(false);
  const [isFiltered, setIsFiltered] = useState(true);
  const isMobile = useMediaQuery("(max-width: 36em)");
  const navigate = useNavigate();

  const setSortedProducts = (products: Product[]) => {
    setProducts(
      products
        .filter((product) => !product.tags.includes("out_of_stock"))
        .concat(products.filter((product) => product.tags.includes("out_of_stock"))),
    );
  };

  const searchProducts = () => {
    const url = new URL(window.location.href);
    const search = url.searchParams.get("search")?.toLowerCase();
    if (!search) return;

    getProducts().then((products) =>
      setSortedProducts(
        products.filter((product) => `${product.name}${product.custom_id && ` - ${product.custom_id}`}`.toLowerCase().includes(search)),
      ),
    );
    setIsLoaded(true);
  };

  useEffect(() => {
    setDocumentTitle("Catalog");

    const url = new URL(window.location.href);

    if (url.searchParams.get("search")) return searchProducts();

    if (!url.searchParams.get("filters"))
      getProducts().then((products) => {
        setSortedProducts(products);
        setIsLoaded(true);
      });
  }, []);

  function filterProducts(newFilters: Filter[], fromFilterList: boolean = true) {
    getProducts().then(async (products) => {
      for (const filter of newFilters) {
        switch (filter.type) {
          case "color":
            products = products.filter((product) => !!product.expand?.colors?.find((productColor) => productColor.name === filter.value));
            break;
          case "category":
            products = products.filter((product) => !!product.expand?.category?.find((productCategory) => productCategory.name === filter.value));
            break;
          case "brand":
            products = products.filter((product) => product.brand === filter.value);
            break;
        }
      }

      setSortedProducts(products);
      setIsFiltered(true);
      !isLoaded && setIsLoaded(true);

      if (fromFilterList && newFilters.length > 0) {
        const categoryFilters = newFilters
          .filter((filter) => filter.type === "category")
          .map(async (filter) => (await searchCategory(filter.value)).id);
        const colorFilters = newFilters.filter((filter) => filter.type === "color").map(async (filter) => (await searchColor(filter.value)).id);
        const brandFilters = newFilters.filter((filter) => filter.type === "brand");
        Promise.all(categoryFilters)
          .then((resolvedCategoryFilters) => {
            Promise.all(colorFilters)
              .then((resolvedColorFilters) => {
                const filtersQueryString = [
                  ...(resolvedCategoryFilters.length > 0 ? [`category:${resolvedCategoryFilters.join("+")}`] : []),
                  ...(resolvedColorFilters.length > 0 ? [`color:${resolvedColorFilters.join("+")}`] : []),
                  ...(brandFilters.length > 0 ? [`brand:${brandFilters.map((filter) => filter.value).join("+")}`] : []),
                ].join(",");
                navigate(`/catalog?filters=${filtersQueryString}`);
              })
              .catch(() => {});
          })
          .catch(() => {});
      }
      if (fromFilterList && newFilters.length === 0) navigate("/catalog");
    });
  }

  useEffect(() => {
    const handleHrefChange = async () => {
      const urlSearchParams = new URL(window.location.href).searchParams;
      const filtersParam = urlSearchParams.get("filters");
      const searchParam = urlSearchParams.get("search");
      if (filtersParam) {
        const allFilters = filtersParam.split(",");
        const categoryFilters = await Promise.all(
          allFilters
            .filter((filter) => filter.startsWith("category:"))
            .map(async (filter) => {
              const categoryIDs = filter.replace("category:", "").replaceAll(" ", "+").split("+");
              const categoryPromises = categoryIDs.map(async (id) => {
                const category = await getCategory(id);
                return category?.name;
              });
              const categories = await Promise.all(categoryPromises);
              return categories;
            }),
        );
        const colorFilters = await Promise.all(
          allFilters
            .filter((filter) => filter.startsWith("color:"))
            .map(async (filter) => {
              const colorIDs = filter.replace("color:", "").replace(" ", "+").split("+");
              const colorPromises = colorIDs.map(async (id) => {
                const color = await getColor(id);
                return color?.name;
              });
              const colors = await Promise.all(colorPromises);
              return colors;
            }),
        );
        const brandFilters = allFilters.filter((filter) => filter.startsWith("brand:")).map((filter) => filter.replace("brand:", ""));
        const filters: Filter[] = [];
        categoryFilters.forEach((categories) => {
          categories.forEach((category) => {
            filters.push({ type: "category", value: category });
          });
        });
        colorFilters.forEach((colors) => {
          colors.forEach((color) => {
            filters.push({ type: "color", value: color });
          });
        });
        brandFilters.forEach((brand) => {
          filters.push({ type: "brand", value: brand });
        });
        setIsFiltered(false);
        setFilters(filters);
        filterProducts(filters, false);
      } else if (searchParam) {
        // note: assuming no filtering and searching at the same time
        setFilters([]);
        searchProducts();
      } else {
        setIsFiltered(false);
        setFilters([]);
        filterProducts([], false);
      }
    };

    handleHrefChange();
  }, [window.location.href]);

  const updateFilters = (type: FilterTypes) => {
    return (values: string[]) => {
      const newFilters: Filter[] = [];
      for (const filter of filters) if (filter.type !== type) newFilters.push(filter);

      for (const value of values) newFilters.push({ type, value });

      setIsFiltered(false);
      setFilters(newFilters);
      filterProducts(newFilters);
    };
  };

  const getFilterValues = (type: FilterTypes) => filters.filter((filter) => filter.type === type).map((value) => value.value);

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

                for (const product of products) if (!brands.includes(product.brand)) brands.push(product.brand);

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

  if (!isLoaded) return <LoaderBox />;

  return (
    <Box className={classes.container}>
      <SmallChangeHelmet title="Catalog" description="Browse through our wide selection of products!" location="catalog" />
      <Modal
        opened={modalOpened}
        onClose={() => {
          setModalOpened(false);
        }}
        title={"Filters"}
        withCloseButton
      >
        <FilterNavBar />
      </Modal>
      <Box visibleFrom="xs">
        <FilterNavBar />
      </Box>
      <Box w="80%" display={"flex"} style={{ alignItems: "center", flexDirection: "column" }} mb="5%" hiddenFrom="xs">
        <Title ta="center" order={1} mb="5%">
          Catalog
        </Title>
        <Button
          leftSection={<IconFilter size="1rem" stroke={1.5} />}
          variant="light"
          radius="xl"
          onClick={() => {
            setModalOpened(true);
          }}
        >
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
        {!isFiltered ? (
          <LoaderBox />
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
                <ProductCard product={product} key={product.id} isMobile={isMobile} />
              ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
