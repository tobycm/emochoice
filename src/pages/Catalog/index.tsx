import { Box, Checkbox, CheckboxGroup, InputBase, Loader, NavLink, Pill, Text } from "@mantine/core";
import { IconCategory, IconColorFilter, IconIcons, IconShirt } from "@tabler/icons-react";
import { ListResult } from "pocketbase";
import { useEffect, useState } from "react";
import ProductCard from "../../components/Card";
import { getProducts } from "../../lib/database";
import { Product } from "../../lib/database/models";
import { setDocumentTitle } from "../../lib/utils";
import classes from "./index.module.css";

type FilterTypes = "color" | "size" | "category" | "brand";

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

  const getFilteredProducts = (newFilters: Filter[]) => {
    const items = [];
    // also update products
    for (const item of products.items)
      if (
        newFilters.every((filter) => {
          if (filter.type === "color" && item.expand.colors) return item.expand.colors.filter((color) => color.name === filter.value).length > 0;
          if (filter.type === "size") return item.sizes.includes(filter.value);
          if (filter.type === "category" && item.expand.category)
            return item.expand.category.filter((category) => category.name === filter.value).length > 0;
          if (filter.type === "brand") return item.brand == filter.value;
        })
      )
        items.push(item);

    let filterString = "";

    for (const filter of newFilters) {
      if (filter.type === "color") filterString += `&& colors.name ?= "${filter.value}"`;
      if (filter.type === "size") filterString += `&& sizes ~ "${filter.value}"`;
      if (filter.type === "category") filterString += `&& category.name ?= "${filter.value}"`;
      if (filter.type === "brand") filterString += `&& brand = "${filter.value}"`;
    }

    if (filterString.slice(0, 3) === "&& ") filterString = filterString.slice(3);

    getProducts(0, filterString).then((products) => {
      setProducts(products);
    });
  };

  const updateFilters = (type: FilterTypes) => {
    return (values: string[]) => {
      const newFilters: Filter[] = [];
      for (const filter of filters) if (filter.type !== type) newFilters.push(filter);

      for (const value of values) newFilters.push({ type, value });

      setFilters(newFilters);
      getFilteredProducts(newFilters);
    };
  };

  const getFilterValues = (type: FilterTypes) => filters.filter((filter) => filter.type === type).map((value) => value.value);

  useEffect(() => {
    setDocumentTitle("Catalog");
    getProducts().then((products) => {
      setProducts(products);
      setIsLoaded(true);
    });
  }, []);

  return (
    <Box className={classes.container}>
      <Box mih={"100%"} miw={200} style={{ flex: "0.5" }} visibleFrom="xs">
        <NavLink label="Category" leftSection={<IconCategory size="1rem" stroke={1.5} />} childrenOffset={28} defaultOpened>
          <CheckboxGroup value={getFilterValues("category")} onChange={updateFilters("category")}>
            {(() => {
              const categories: string[] = [];

              for (const product of products.items) {
                if (product.expand.category)
                  for (const category of product.expand.category) if (!categories.includes(category.name)) categories.push(category.name);
              }

              return categories.map((size) => <Checkbox mb={5} mt={5} label={size} value={size} />);
            })()}
          </CheckboxGroup>
        </NavLink>
        <NavLink label="Fit" leftSection={<IconShirt size="1rem" stroke={1.5} />} childrenOffset={28} defaultOpened>
          <CheckboxGroup value={getFilterValues("size")} onChange={updateFilters("size")}>
            {(() => {
              const sizes: string[] = [];

              for (const product of products.items) {
                for (const size of product.sizes.split(",")) if (!sizes.includes(size) && size.length > 0) sizes.push(size);
              }

              return sizes.map((size) => <Checkbox mb={5} mt={5} label={size} value={size} />);
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
                      getFilteredProducts(newFilters);
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
