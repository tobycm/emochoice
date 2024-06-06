import { Product, ProductBrand, ProductCategory, ProductColor } from "./models";

export function categoriesFromProducts(products: Product[]): ProductCategory[] {
  return Array.from(
    new Set(
      products
        .map((product) => product.expand.category)
        .filter((category) => category)
        .flat() as ProductCategory[],
    ),
  );
}

export function colorsFromProducts(products: Product[]): ProductColor[] {
  return Array.from(
    new Set(
      products
        .map((product) => product.expand.colors)
        .filter((color) => color)
        .flat() as ProductColor[],
    ),
  );
}

export function brandsFromProducts(products: Product[]): ProductBrand[] {
  return Array.from(
    new Set(
      products
        .map((product) => product.expand.brand)
        .filter((brand) => brand)
        .flat() as ProductBrand[],
    ),
  );
}
