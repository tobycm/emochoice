import { Product, ProductBrand, ProductCategory, ProductColor } from "../../lib/database/models";

export function outOfStockToEnd(products: Product[]) {
  return products
    .filter((product) => !product.tags.includes("out_of_stock"))
    .concat(products.filter((product) => product.tags.includes("out_of_stock")));
}

export interface Filter {
  type: "color" | "category" | "brand";
  value: ProductBrand | ProductCategory | ProductColor;
}

export function getFilters(products: Product[], ids: string[]) {
  const brands: ProductBrand[] = [];
  const categories: ProductCategory[] = [];
  const colors: ProductColor[] = [];

  for (const product of products) {
    if (!brands.find((brand) => brand.id === product.brand)) brands.push(product.expand.brand);
    for (const category of product.expand.category || []) if (!categories.find((c) => c.id === category.id)) categories.push(category);
    for (const color of product.expand.colors || []) if (!colors.find((c) => c.id === color.id)) colors.push(color);
  }

  return ids
    .map((id) => {
      const brand = brands.find((brand) => brand.id === id);
      if (brand) return { type: "brand", value: brand };

      const category = categories.find((category) => category.id === id);
      if (category) return { type: "category", value: category };

      const color = colors.find((color) => color.id === id);
      if (color) return { type: "color", value: color };
    })
    .filter((filter) => !!filter) as Filter[];
}

export function filterProducts(products: Product[], filters: Filter[]) {
  if (!filters.length) return products;

  return products.filter((product) =>
    filters.every((filter) => {
      switch (filter.type) {
        case "brand":
          return product.brand === filter.value.id;
        case "category":
          return product.category.includes(filter.value.id);
        case "color":
          return product.colors.includes(filter.value.id);
      }
    }),
  );
}
