import { Product, ProductBrand, ProductCategory, ProductColor } from "./models";

export function categoriesFromProducts(products: Product[]): ProductCategory[] {
  const categories: ProductCategory[] = [];

  products
    .map((product) => product.expand.category)
    .flat()
    .forEach((category) => category && categories.every((c) => c.id !== category.id) && categories.push(category));

  return categories;
}

export function colorsFromProducts(products: Product[]): ProductColor[] {
  const colors: ProductColor[] = [];

  products
    .map((product) => product.expand.colors)
    .flat()
    .forEach((color) => color && colors.every((c) => c.id !== color.id) && colors.push(color));

  return colors;
}

export function brandsFromProducts(products: Product[]): ProductBrand[] {
  const brands: ProductBrand[] = [];

  products
    .map((product) => product.expand.brand)
    .flat()
    .forEach((brand) => brand && brands.every((b) => b.id !== brand.id) && brands.push(brand));

  return brands;
}
