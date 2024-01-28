import { getProducts } from "../../lib/database";
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

export async function getFilters(ids: string[]) {
  const products = await getProducts();

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

export async function filterProducts(filters: Filter[]) {
  const products = await getProducts();

  return !filters.length
    ? products
    : products.filter((product) =>
        filters.every(
          (filter) => product.brand === filter.value.id || product.category?.includes(filter.value.id) || product.colors?.includes(filter.value.id),
        ),
      );
}

export function getFilterValues(filters: Filter[], type: Filter["type"]) {
  return filters.filter((filter) => filter.type === type).map((value) => value.value.name);
}

export function updateFilters(currentFilters: Filter[], type: Filter["type"], values: Filter["value"][], setFilters: (filters: Filter[]) => void) {
  return (newValues: string[]) => {
    const newFilters = currentFilters.filter((filter) => filter.type !== type);

    for (const selected of newValues) {
      const value = values.find((value) => value.name === selected)!;

      if (newFilters.find((filter) => filter.value.id === value.id)) continue;

      newFilters.push({ type, value });
    }

    console.log("before set new filters", { newFilters });

    setFilters(newFilters);
  };
}
