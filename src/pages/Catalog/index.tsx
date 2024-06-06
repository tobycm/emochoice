import { Box, Button, Checkbox, Flex, InputBase, Modal, NavLink, Pill, ScrollArea, Text, Title, UnstyledButton } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { IconCategory, IconColorFilter, IconFilter, IconIcons, IconSearchOff } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SmallChangeHelmet from "../../components/Helmets/SmallChangeHelmet";
import ProductCard from "../../components/ProductCard";
import { getProducts } from "../../lib/database";
import { Product, ProductBrand, ProductCategory, ProductColor } from "../../lib/database/models";
import { brandsFromProducts, categoriesFromProducts, colorsFromProducts } from "../../lib/database/utils";
import LoaderBox, { setDocumentTitle, toTitleCase } from "../../lib/utils";
import { convertToKeywords } from "../../lib/utils/search";
import classes from "./index.module.css";

type FilterTypes = "color" | "category" | "brand";

interface Filter {
  type: FilterTypes;
  value: string;
}

export default function Catalog() {
  const products = useQuery({ queryKey: ["products"], queryFn: getProducts, placeholderData: [] });

  const categories: ProductCategory[] = useMemo(() => categoriesFromProducts(products.data!), [products.data]);
  const colors: ProductColor[] = useMemo(() => colorsFromProducts(products.data!), [products.data]);
  const brands: ProductBrand[] = useMemo(() => brandsFromProducts(products.data!), [products.data]);

  const [realProducts, setProducts] = useState<Product[]>(products.data!);

  useEffect(() => {
    setProducts(products.data!);
  }, [products.data]);

  const [filters, setFilters] = useState<Filter[]>([]);
  const filterModal = useDisclosure(false);
  const isMobile = useMediaQuery("(max-width: 48em)");
  const navigate = useNavigate();

  const [searchedColor, setSearchedColor] = useState<string>("");

  function sortOutOfStock(products: Product[]) {
    return products
      .filter((product) => !product.tags.includes("out_of_stock"))
      .concat(products.filter((product) => product.tags.includes("out_of_stock")));
  }

  function searchProducts() {
    const url = new URL(window.location.href);
    const search = url.searchParams.get("search")?.toLowerCase();
    if (!search) return;

    const keywords = convertToKeywords(search);

    const keywordForColor = keywords.find((keyword) => colors.some((color) => color.name.toLowerCase().includes(keyword)));

    const color = keywordForColor ? colors.find((color) => color.name.toLowerCase().includes(keywordForColor)) : "";

    if (color) setSearchedColor(color.name);

    setProducts(
      sortOutOfStock(
        products.data!.filter((product) =>
          keywords.every((keyword) =>
            `${product.name} | ${(product.expand.colors ?? []).map((color) => color.name).join(" ")} | ${product.custom_id} | ${(product.expand.types ?? []).map((type) => type.name).join(" ")} | ${(product.expand.category ?? []).map((category) => category.name).join(" ")} | ${product.expand.brand.name}`
              .toLowerCase()
              .includes(keyword),
          ),
        ),
      ),
    );
  }

  useEffect(() => {
    setDocumentTitle("Catalog");

    const url = new URL(window.location.href);

    if (url.searchParams.get("search")) return searchProducts();

    if (!url.searchParams.get("filters")) {
      setProducts(sortOutOfStock(products.data!));
    }
  }, []);

  function filterProducts(newFilters: Filter[], fromFilterList: boolean = true) {
    let filteredProducts = products.data!;

    for (const filter of newFilters) {
      if (filter.type === "category")
        filteredProducts = filteredProducts.filter(
          (product) => !!product.expand?.category?.find((productCategory) => productCategory.name === filter.value),
        );
      if (filter.type === "color")
        filteredProducts = filteredProducts.filter((product) => !!product.expand?.colors?.find((productColor) => productColor.name === filter.value));
      if (filter.type === "brand") filteredProducts = filteredProducts.filter((product) => product.expand.brand.name === filter.value);
    }

    setProducts(sortOutOfStock(filteredProducts));

    if (fromFilterList && newFilters.length > 0) {
      // we should refactor to use whole objects with ids instead of names
      // kinda dangerous to rely on names -> not unique

      const categoryFilters = newFilters
        .filter((filter) => filter.type === "category")
        .map((filter) => categories.find((category) => category.name === filter.value)?.id)
        .filter((id) => id !== undefined);

      const colorFilters = newFilters
        .filter((filter) => filter.type === "color")
        .map((filter) => colors.find((color) => color.name === filter.value)?.id)
        .filter((id) => id !== undefined);

      const brandFilters = newFilters
        .filter((filter) => filter.type === "brand")
        .map((filter) => brands.find((brand) => brand.name === filter.value)?.id)
        .filter((id) => id !== undefined);

      const filtersQueryStrings: string[] = [];

      if (categoryFilters.length > 0) filtersQueryStrings.push(`category:${categoryFilters.join("+")}`);
      if (colorFilters.length > 0) filtersQueryStrings.push(`color:${colorFilters.join("+")}`);
      if (brandFilters.length > 0) filtersQueryStrings.push(`brand:${brandFilters.join("+")}`);

      navigate(`/catalog?filters=${filtersQueryStrings.join(",")}`);
    }
    if (fromFilterList && newFilters.length === 0) navigate("/catalog");
  }

  useEffect(() => {
    const urlSearchParams = new URL(window.location.href).searchParams;
    const filtersParam = urlSearchParams.get("filters");
    const searchParam = urlSearchParams.get("search");

    if (!filtersParam && !searchParam) {
      setFilters([]);
      filterProducts([], false);
      return;
    }

    if (filtersParam) {
      const allFilters = filtersParam.split(",");

      const filtersMapping = {
        category: categories,
        color: colors,
        brand: brands,
      };

      for (const filter of allFilters) {
        const [type, values] = filter.split(":");
        if (!Object.keys(filtersMapping).includes(type)) continue;
        if (values.length === 0) continue;
        for (const value of values.replaceAll(" ", "+").split("+")) {
          if (!filtersMapping[type as keyof typeof filtersMapping].map((filter) => filter.name).includes(value)) continue;
        }
      }

      const categoryFilters = allFilters
        .filter((filter) => filter.startsWith("category:"))
        .map((filter) => filter.replace("category:", "").replaceAll(" ", "+").split("+"))
        .flat()
        .map((id) => categories.find((category) => category.id === id)?.name)
        .filter((id) => id !== undefined)
        .map((category) => ({ type: "category", value: category }));

      const colorFilters = allFilters
        .filter((filter) => filter.startsWith("color:"))
        .map((filter) => filter.replace("color:", "").replaceAll(" ", "+").split("+"))
        .flat()
        .map((id) => colors.find((color) => color.id === id)?.name)
        .filter((id) => id !== undefined)
        .map((color) => ({ type: "color", value: color }));

      const brandFilters = allFilters
        .filter((filter) => filter.startsWith("brand:"))
        .map((filter) => filter.replace("brand:", "").replace(" ", "+").split("+"))
        .flat()
        .map((id) => brands.find((brand) => brand.id === id)?.name)
        .filter((id) => id !== undefined)
        .map((brand) => ({ type: "brand", value: brand }));

      const filters = [...categoryFilters, ...colorFilters, ...brandFilters] as Filter[];

      setFilters(filters);
      filterProducts(filters, false);
    }
    if (searchParam) searchProducts();
  }, [window.location.href, categories, colors, brands]);

  const updateFilters = (type: FilterTypes) => (values: string[]) => {
    const newFilters: Filter[] = [];
    for (const filter of filters) if (filter.type !== type) newFilters.push(filter);

    for (const value of values) newFilters.push({ type, value });

    setFilters(newFilters);
    filterProducts(newFilters);
  };

  const getFilterValues = (type: FilterTypes) => filters.filter((filter) => filter.type === type).map((value) => value.value);

  const [openCategoryFilter, categoryFilter] = useDisclosure(true);
  const [openBrandFilter, brandFilter] = useDisclosure(true);
  const [openColorFilter, colorFilter] = useDisclosure(true);

  if (products.isFetching) return <LoaderBox text="Loading products..." />;

  function FilterNavBar() {
    const categories: ProductCategory[] = useMemo(() => categoriesFromProducts(realProducts), [realProducts]);
    const colors: ProductColor[] = useMemo(() => colorsFromProducts(realProducts), [realProducts]);
    const brands: ProductBrand[] = useMemo(() => brandsFromProducts(realProducts), [realProducts]);

    return (
      <Box mih="100%" w={!isMobile ? 200 : "auto"} flex={0.5}>
        <NavLink
          label="Categories"
          leftSection={<IconCategory size="1rem" stroke={1.5} />}
          childrenOffset={28}
          opened={openCategoryFilter}
          onClick={categoryFilter.toggle}
        >
          <Checkbox.Group value={getFilterValues("category")} onChange={updateFilters("category")}>
            <ScrollArea.Autosize mah={!isMobile ? 250 : "auto"}>
              {categories.map((category) => (
                <Checkbox mb={5} mt={5} label={category.name.replaceAll("/", " / ")} value={category.name} key={category.id} />
              ))}
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
              {brands.map((brand) => (
                <Checkbox mb={5} mt={5} label={brand.name} value={brand.name} key={brand.id} />
              ))}
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
              {colors.map((color) => (
                <Checkbox mb={5} mt={5} label={toTitleCase(color.name)} value={color.name} key={color.id} />
              ))}
            </ScrollArea.Autosize>
          </Checkbox.Group>
        </NavLink>
      </Box>
    );
  }

  return (
    <Flex justify="center" wrap="wrap" p="0 4% 0 4%" mih="50vh" className={classes.container}>
      <SmallChangeHelmet title="Catalog" description="Browse through our wide selection of products!" location="catalog" />
      <Modal opened={filterModal[0]} onClose={filterModal[1].close} title="Filters" withCloseButton>
        {/* if it works it works */}
        <ScrollArea.Autosize mah="calc(var(--_content-max-height,calc(100dvh - var(--modal-y-offset)*2)) - var(--mantine-spacing-md) * 2 - 96px)">
          <FilterNavBar />
        </ScrollArea.Autosize>
        <Flex mt="md" justify="flex-end">
          <Button onClick={filterModal[1].close} leftSection={<IconFilter size="1rem" stroke={1.5} />}>
            Apply
          </Button>
        </Flex>
      </Modal>
      <Box visibleFrom="xs">
        <FilterNavBar />
      </Box>
      <Flex w="80%" align="center" direction="column" mb="5%" hiddenFrom="xs">
        <Title ta="center" order={1} mb="5%">
          Catalog
        </Title>
        <Button leftSection={<IconFilter size="1rem" stroke={1.5} />} variant="light" radius="xl" onClick={filterModal[1].open}>
          Filters
        </Button>
      </Flex>
      <Box flex={4.5}>
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
        {realProducts.length === 0 ? (
          <Flex justify="center" align="center" direction="column" w="100%" h="50vh">
            <IconSearchOff style={{ width: "30%", height: "30%", marginBottom: "1em" }} stroke={1} />
            <Title ta="center" order={1} mb="md">
              No Products Found
            </Title>
            <Text>
              <UnstyledButton
                onClick={() => {
                  setProducts(sortOutOfStock(products.data!));
                  setFilters([]);
                }}
                style={{ color: "black", textDecoration: "underline" }}
              >
                Clear
              </UnstyledButton>{" "}
              filters/queries and try again.
            </Text>
          </Flex>
        ) : (
          <Flex wrap="wrap" className={classes.cardsBox}>
            {realProducts
              .filter((p) => !p.hidden)
              .map((product) => (
                <ProductCard product={product} key={product.id} isMobile={isMobile} searchedColor={searchedColor} />
              ))}
          </Flex>
        )}
      </Box>
    </Flex>
  );
}
