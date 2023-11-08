import { Box, Button, Checkbox, CheckboxGroup, InputBase, Loader, Modal, NavLink, Pill, Text, Title } from "@mantine/core";
import { IconCategory, IconColorFilter, IconFilter, IconIcons } from "@tabler/icons-react";
import { ListResult } from "pocketbase";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import ProductCard from "../../components/Card";
import { getProducts, searchProducts } from "../../lib/database";
import { Product } from "../../lib/database/models";
import { setDocumentTitle } from "../../lib/utils";
import classes from "./index.module.css";

type FilterTypes = "color" | "category" | "brand";

interface Filter {
  type: FilterTypes;
  value: string;
}

export default function Catalog() {
  const [products, setProducts] = useState<ListResult<Product>>({
    items: [],
    page: 0,
    perPage: 0,
    totalItems: 0,
    totalPages: 0,
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [modalOpened, setModalOpened] = React.useState<boolean>(false);

  let user: {
    searchQuery: string;
  } | null = null;

  const location = useLocation();
  if (location.state) user = location.state;

  if (user) {
    searchProducts(user.searchQuery.toLowerCase()).then((products) => {
      user = null;
      setProducts(products);
      setIsLoaded(true);
    });
  }

  const filterProducts = (newFilters: Filter[]) => {
    const items = [];
    // also update products
    for (const item of products.items)
      if (
        newFilters.every((filter) => {
          switch (filter.type) {
            case "color":
              return item.expand.colors ? item.expand.colors.filter((color) => color.name === filter.value).length > 0 : false;
            case "category":
              return item.expand.category ? item.expand.category.filter((category) => category.name === filter.value).length > 0 : false;
            case "brand":
              return item.brand == filter.value;
          }
        })
      )
        items.push(item);

    let filterString = "";

    for (const filter of newFilters) {
      if (filter.type === "color") filterString += `&& colors.name ?= "${filter.value}"`;
      if (filter.type === "category") filterString += `&& category.name ?= "${filter.value}"`;
      if (filter.type === "brand") filterString += `&& brand = "${filter.value}"`;
    }

    if (filterString.slice(0, 3) === "&& ") filterString = filterString.slice(3);

    getProducts(0, filterString).then(setProducts);
  };

  const updateFilters = (type: FilterTypes) => {
    return (values: string[]) => {
      const newFilters: Filter[] = [];
      for (const filter of filters) if (filter.type !== type) newFilters.push(filter);

      for (const value of values) newFilters.push({ type, value });

      setFilters(newFilters);
      filterProducts(newFilters);
    };
  };

  const getFilterValues = (type: FilterTypes) => filters.filter((filter) => filter.type === type).map((value) => value.value);

  useEffect(() => {
    setDocumentTitle("Catalog");
    getProducts().then((products) => {
      setProducts(products);
      if (user === null) setIsLoaded(true);
    });
  }, []);

  function FilterNavBar() {
    return (
      <Box mih={"100%"} miw={200} style={{ flex: "0.5" }}>
        <NavLink label="Category" leftSection={<IconCategory size="1rem" stroke={1.5} />} childrenOffset={28} defaultOpened>
          <CheckboxGroup value={getFilterValues("category")} onChange={updateFilters("category")}>
            {(() => {
              const categories: string[] = [];

              for (const product of products.items) {
                if (product.expand.category)
                  for (const category of product.expand.category) if (!categories.includes(category.name)) categories.push(category.name);
              }

              return categories.map((category) => <Checkbox mb={5} mt={5} label={category} value={category} />);
            })()}
          </CheckboxGroup>
        </NavLink>
        <NavLink label="Brand" leftSection={<IconIcons size="1rem" stroke={1.5} />} childrenOffset={28} defaultOpened>
          <CheckboxGroup value={getFilterValues("brand")} onChange={updateFilters("brand")}>
            {(() => {
              const brands: string[] = [];

              for (const product of products.items) {
                if (!brands.includes(product.brand)) brands.push(product.brand);
              }

              return brands.map((brand) => <Checkbox mb={5} mt={5} label={brand} value={brand} />);
            })()}
          </CheckboxGroup>
        </NavLink>
        <NavLink label="Colour" leftSection={<IconColorFilter size="1rem" stroke={1.5} />} childrenOffset={28} defaultOpened>
          <CheckboxGroup value={getFilterValues("color")} onChange={updateFilters("color")}>
            {(() => {
              const colors: string[] = [];

              for (const product of products.items) {
                if (product.expand.colors) for (const color of product.expand.colors) if (!colors.includes(color.name)) colors.push(color.name);
              }

              return colors.map((color) => <Checkbox mb={5} mt={5} label={color} value={color} />);
            })()}
          </CheckboxGroup>
        </NavLink>
      </Box>
    );
  }

  return (
    <Box className={classes.container}>
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
        <Title order={2} mb="5%">
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
      {isLoaded ? (
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
          <Box className={classes.cardsBox}>
            {products.items.map((product) => (
              <ProductCard product={product} />
            ))}
          </Box>
        </Box>
      ) : (
        <Box display="flex" style={{ justifyContent: "center", alignItems: "center" }} w="80%">
          <Loader size="xl" />
        </Box>
      )}
    </Box>
  );
}
