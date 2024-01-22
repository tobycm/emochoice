import { Box, Checkbox, NavLink, ScrollArea } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { IconCategory, IconColorFilter, IconIcons } from "@tabler/icons-react";
import { useEffect, useState } from "preact/hooks";
import { getProducts } from "../../lib/database";
import { ProductBrand, ProductCategory, ProductColor } from "../../lib/database/models";
import { toTitleCase } from "../../lib/utils";
import { Filter } from "./utils";

export default function FilterNavBar({ setFilters, filters }: { setFilters: (filters: Filter[]) => void; filters: Filter[] }) {
  const [brands, setBrands] = useState<ProductBrand[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [colors, setColors] = useState<ProductColor[]>([]);

  useEffect(() => {
    getProducts().then((products) => {
      const brands: ProductBrand[] = [];
      const categories: ProductCategory[] = [];
      const colors: ProductColor[] = [];

      for (const product of products) {
        if (!brands.find((brand) => brand.id === product.expand.brand.id)) brands.push(product.expand.brand);
        for (const category of product.expand.category ?? []) if (!categories.find((cat) => cat.id === category.id)) categories.push(category);
        for (const color of product.expand.colors ?? []) if (!colors.find((col) => col.id === color.id)) colors.push(color);
      }

      setBrands(brands);
      setCategories(categories);
      setColors(colors);
    });
  }, []);

  const isMobile = useMediaQuery("(max-width: 36em)");

  const [openCategoryFilter, categoryFilter] = useDisclosure(true);
  const [openBrandFilter, brandFilter] = useDisclosure(true);
  const [openColorFilter, colorFilter] = useDisclosure(true);

  function getFilterValues(type: Filter["type"]) {
    return filters.filter((filter) => filter.type === type).map((value) => value.value.name);
  }

  function updateFilters(type: Filter["type"]) {
    return (values: string[]) => {
      const newFilters = filters.filter((filter) => filter.type !== type);

      for (const selected of values) {
        let value: Filter["value"];

        switch (type) {
          case "color":
            value = colors.find((color) => color.name === selected)!;
            break;
          case "category":
            value = categories.find((category) => category.name === selected)!;
            break;
          case "brand":
            value = brands.find((brand) => brand.name === selected)!;
            break;
        }

        if (newFilters.find((filter) => filter.value.id === value.id)) continue;
        newFilters.push({ type, value });
      }

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
