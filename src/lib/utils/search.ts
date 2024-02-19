import { Product } from "../database/models";

// string[] is an array of lowercase strings
export function convertToKeywords(text: string): string[] {
  return text
    .split(" ")
    .map((word) => word.toLowerCase())
    .filter((word) => word.match(/^[a-zA-Z0-9]*$/gm))
    .filter((word) => word.length > 0);
}

export interface ProductWithKeywords extends Product {
  keywords: string;
}

export function searchProducts(products: ProductWithKeywords[], searchQuery: string, colors?: string[]) {
  if (!products) return [];

  if (colors === undefined) {
    colors = [];

    products.forEach((product) => {
      product.expand.colors?.forEach((color) => {
        if (colors!.includes(color.name)) return;
        colors!.push(color.name);
      });
    });
  }

  const searchKeywords = convertToKeywords(searchQuery.toLowerCase());

  const searchResults: string[] = [];

  products.forEach((product) => {
    if (!searchKeywords.every((keyword) => product.keywords.includes(keyword))) return;

    const keywordForColor = searchKeywords.find((keyword) => colors!.some((color) => color.toLowerCase().includes(keyword)));

    if (keywordForColor)
      searchResults.push(`${product.name} - ${product.custom_id} - ${colors!.find((color) => color.toLowerCase().includes(keywordForColor))}`);
    else searchResults.push(`${product.name} - ${product.custom_id}`);
  });

  return searchResults;
}
