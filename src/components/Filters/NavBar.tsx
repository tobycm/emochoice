import { Box, Checkbox, NavLink, ScrollArea } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { IconCategory, IconColorFilter, IconIcons } from "@tabler/icons-react";
import { useEffect, useRef } from "preact/hooks";
import { getProducts } from "../../lib/database";
import { Product, ProductCategory } from "../../lib/database/models";
import { toTitleCase } from "../../lib/utils";
import { Filter } from "./utils";

export default function FilterNavBar({ setFilters, filters }: { setFilters: (filters: Filter[]) => void; filters: Filter[] }) {
  const isMobile = useMediaQuery("(max-width: 36em)");

  const products = useRef<Product[]>([]);

  useEffect(() => {
    getProducts().then((p) => (products.current = p));
  }, []);

  const categories: ProductCategory[] = [];
  for (const product of products.current)
    for (const category of product.expand.category ?? []) if (!categories.find((cat) => cat.id === category.id)) categories.push(category);

  const brands: ProductCategory[] = [];
  for (const product of products.current) if (!brands.find((brand) => brand.id === product.brand)) brands.push(product.expand.brand);

  const colors: ProductCategory[] = [];
  for (const product of products.current)
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
