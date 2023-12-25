import { Box, Checkbox, NavLink, ScrollArea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCategory, IconColorFilter, IconIcons } from "@tabler/icons-react";
import React, { useEffect } from "react";
import { getProducts } from "../../lib/database";
import { Product } from "../../lib/database/models";
import { toTitleCase } from "../../lib/utils";
import SmallChangeHelmet from "../Helmets/SmallChangeHelmet";

type FilterTypes = "color" | "category" | "brand";

interface Filter {
  type: FilterTypes;
  value: string;
}

export default function FilterNavBar(props: {
  onFiltered: (products: Product[], filters: Filter[]) => void;
}): [React.JSX.Element, (newFilters: Filter[]) => void] {
  const { onFiltered } = props;

  const [products, setProducts] = React.useState<Product[]>([]);

  useEffect(() => {
    getProducts().then((products) => {
      setProducts(products);
    });
  }, []);

  function filterProducts(filters: Filter[]) {
    getProducts().then((products) => {
      for (const filter of filters) {
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

      setProducts(products);
      onFiltered(products, filters);
    });
  }

  function updateFilters(type: FilterTypes) {
    return (filters: string[]) => {
      filterProducts(
        filters.map((filter) => ({
          type,
          value: filter,
        })),
      );
    };
  }

  function getFilterValues(type: FilterTypes) {
    switch (type) {
      case "color":
        return products
          .map((product) => product.expand?.colors)
          .filter((colors) => !!colors)
          .flat(1)
          .map((color) => color!.name);
      case "category":
        return products
          .map((product) => product.expand?.category)
          .filter((categories) => !!categories)
          .flat(1)
          .map((category) => category!.name);
      case "brand":
        return products.map((product) => product.brand);
    }
  }

  const [openCategoryFilter, categoryFilter] = useDisclosure(false);
  const [openBrandFilter, brandFilter] = useDisclosure(false);
  const [openColorFilter, colorFilter] = useDisclosure(false);

  return [
    <Box mih={"100%"} miw={200} style={{ flex: "0.5" }}>
      <SmallChangeHelmet title="Catalog" description="Browse through our wide selection of products!" location="catalog" />
      <NavLink
        label="Categories"
        leftSection={<IconCategory size="1rem" stroke={1.5} />}
        childrenOffset={28}
        opened={openCategoryFilter}
        onClick={categoryFilter.toggle}
      >
        <Checkbox.Group value={getFilterValues("category")} onChange={updateFilters("category")}>
          <ScrollArea.Autosize mah={200}>
            {(() => {
              const categories: string[] = [];

              for (const product of products)
                if (product.expand?.category)
                  for (const category of product.expand.category) if (!categories.includes(category.name)) categories.push(category.name);

              return categories.map((category) => <Checkbox mb={5} mt={5} label={category} value={category} key={category} />);
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
          <ScrollArea.Autosize mah={200}>
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
          <ScrollArea.Autosize mah={200}>
            {(() => {
              const colors: string[] = [];

              for (const product of products)
                if (product.expand?.colors) for (const color of product.expand.colors) if (!colors.includes(color.name)) colors.push(color.name);

              return colors.map((color) => <Checkbox mb={5} mt={5} label={toTitleCase(color)} value={color} key={color} />);
            })()}
          </ScrollArea.Autosize>
        </Checkbox.Group>
      </NavLink>
    </Box>,
    (newFilters: Filter[]) => {
      filterProducts(newFilters);
    },
  ];
}
