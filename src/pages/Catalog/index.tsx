// new catalog

import { Box, Button, Checkbox, InputBase, Modal, Pill, ScrollArea, Text, Title, UnstyledButton } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { IconCategory, IconColorFilter, IconFilter, IconIcons, IconSearchOff } from "@tabler/icons-react";
import { useEffect, useState } from "preact/hooks";
import { NavLink, useNavigate } from "react-router-dom";
import ProductCard from "../../components/ProductCard";
import { getProducts } from "../../lib/database";
import { Product, ProductCategory } from "../../lib/database/models";
import LoaderBox, { setDocumentTitle, toTitleCase } from "../../lib/utils";
import { Filter, filterProducts, getFilters, outOfStockToEnd } from "../../lib/utils/filters";
import classes from "./index.module.css";

export default function Catalog() {
  const [isLoaded, setIsLoaded] = useState(false);
  const isMobile = useMediaQuery("(max-width: 36em)");
  const navigate = useNavigate();

  const [searchedColor, setSearchedColor] = useState<string>("");

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filters, setFilters] = useState<Filter[]>([]);

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setDocumentTitle("Catalog");

    const url = new URL(window.location.href);

    const searchQuery = url.searchParams.get("search")?.toLowerCase();
    if (searchQuery) setSearchQuery(searchQuery);

    const filtersId = url.searchParams.get("filters")?.split("+");
    if (filtersId) getFilters(filtersId).then(setFilters);
  }, []);

  useEffect(() => {
    filterProducts(filters).then((products) => {
      if (searchQuery) products = products.filter((product) => product.name.toLowerCase().includes(searchQuery));

      products = outOfStockToEnd(products);
      !isLoaded && setIsLoaded(true);

      setProducts(products);
    });
  }, [searchQuery, filters]);

  useEffect(() => {
    if (!filters.length) navigate("/catalog");
    else {
      const url = new URL(window.location.href);
      const newFilters = filters.map((filter) => filter.value.id).join("+");
      if (url.searchParams.get("filters") !== newFilters) {
        url.searchParams.set("filters", newFilters);

        navigate(url.pathname + url.search);
      }
    }
  }, [filters]);

  const [filterModalOpened, filterModalControls] = useDisclosure(false);

  function FilterNavBar() {
    const isMobile = useMediaQuery("(max-width: 36em)");

    useEffect(() => {
      getProducts().then(setProducts);
    }, []);

    const categories: ProductCategory[] = [];
    for (const product of products)
      for (const category of product.expand.category ?? []) if (!categories.find((cat) => cat.id === category.id)) categories.push(category);

    const brands: ProductCategory[] = [];
    for (const product of products) if (!brands.find((brand) => brand.id === product.brand)) brands.push(product.expand.brand);

    const colors: ProductCategory[] = [];
    for (const product of products)
      for (const color of product.expand.colors ?? []) if (!colors.find((col) => col.id === color.id)) colors.push(color);

    const [openCategoryFilter, categoryFilter] = useDisclosure(true);
    const [openBrandFilter, brandFilter] = useDisclosure(true);
    const [openColorFilter, colorFilter] = useDisclosure(true);

    function getFilterValues(type: Filter["type"]) {
      return filters.filter((filter) => filter.type === type).map((value) => value.value.name);
    }

    function updateFilters(type: Filter["type"], values: Filter["value"][]) {
      return (newValues: string[]) => {
        console.log(type, newValues);

        const newFilters = filters.filter((filter) => filter.type !== type);

        console.log({ newFilters });

        for (const selected of newValues) {
          const value = values.find((value) => value.name === selected)!;

          if (newFilters.find((filter) => filter.value.id === value.id)) continue;

          console.log({ type, value });

          newFilters.push({ type, value });
        }

        console.log("before set new filters", { newFilters });

        setFilters(newFilters);
      };
    }

    return (
      <Box mih={"100%"} w={!isMobile ? 200 : "auto"} style={{ flex: "0.5" }}>
        <NavLink
          label="Categories"
          leftSection={<IconCategory size="1rem" stroke={1.5} />}
          childrenOffset={28}
          opened={openCategoryFilter}
          onClick={categoryFilter.toggle}
        >
          <Checkbox.Group value={getFilterValues("category")} onChange={updateFilters("category", categories)}>
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
          <Checkbox.Group value={getFilterValues("brand")} onChange={updateFilters("brand", brands)}>
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
          <Checkbox.Group value={getFilterValues("color")} onChange={updateFilters("color", colors)}>
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

  if (!isLoaded)
    return (
      <Box>
        <LoaderBox />
      </Box>
    );

  return (
    <Box>
      <Box className={classes.container}>
        <Modal opened={filterModalOpened} onClose={filterModalControls.close} title={"Filters"} withCloseButton>
          <FilterNavBar />
        </Modal>
        <Box visibleFrom="xs">
          <FilterNavBar />
        </Box>
        <Box w="80%" display={"flex"} style={{ alignItems: "center", flexDirection: "column" }} mb="5%" hiddenFrom="xs">
          <Title ta="center" order={1} mb="5%">
            Catalog
          </Title>
          <Button leftSection={<IconFilter size="1rem" stroke={1.5} />} variant="light" radius="xl" onClick={filterModalControls.open}>
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
                  <Pill key={filter.value.id} withRemoveButton onRemove={() => setFilters(filters.filter((f) => f.value.id !== filter.value.id))}>
                    {filter.value.name}
                  </Pill>
                ))}
              </Pill.Group>
            </InputBase>
          </Box>
          {products.length === 0 ? (
            <Box display="flex" style={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }} w="100%" h="50vh">
              <IconSearchOff style={{ width: "30%", height: "30%", marginBottom: "1em" }} stroke={1} />
              <Title ta="center" order={1} mb="md">
                No Products Found
              </Title>
              <Text>
                <UnstyledButton
                  onClick={() => {
                    getProducts().then(setProducts);
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
                .filter((product) => !product.hidden)
                .map((product) => (
                  <ProductCard product={product} key={product.id} isMobile={isMobile} />
                ))}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
