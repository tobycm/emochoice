import PocketBase, { RecordModel } from "pocketbase";
import { Product, ProductCategory } from "./models";

const pocketbase = new PocketBase("https://pocketbase.emochoice.ca");

export default pocketbase;

export async function getGallery(name: string) {
  const result = await pocketbase.collection("gallery").getFirstListItem<{ pictures: string[] } & RecordModel>(`name = "${name}"`);
  return result.pictures.map((picture) => pocketbase.getFileUrl(result, picture));
}

export async function searchCategory(query: string) {
  return await pocketbase.collection("categories").getFirstListItem<ProductCategory>(`name ~ "${query}"`);
}

export async function getProducts(page: number = 0, filter: string = "", perPage: number = 24) {
  return await pocketbase.collection("products").getList<Product>(page, perPage, { filter, expand: "category,colors", sort: "-created" });
}

export async function searchProducts(query: string) {
  return await pocketbase.collection("products").getList<Product>(0, 24, { filter: `name ~ "${query}"`, expand: "category,colors" });
}

export async function getProduct(id: string) {
  return await pocketbase.collection("products").getOne<Product>(id, { expand: "category,colors" });
}

const metadataIds = {
  availableBrands: "qt8d6zsesjpw66n",
} as const;

export async function getMetadata(key: keyof typeof metadataIds): Promise<unknown | null> {
  return (await pocketbase.collection("metadata").getOne<{ name: string; value: unknown | null }>(metadataIds[key])).value;
}

export async function getDocument(id: string) {
  return await pocketbase.collection("documents").getOne(id);
}
