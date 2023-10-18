import PocketBase, { RecordModel } from "pocketbase";
import { Product } from "./models";

const pocketbase = new PocketBase("https://pocketbase.emochoice.ca");

export default pocketbase;

export async function getGallery(name: string) {
  const result = await pocketbase.collection("gallery").getFirstListItem<{ pictures: string[] } & RecordModel>(`name = "${name}"`);

  const images = result.pictures.map((picture) => pocketbase.getFileUrl(result, picture));

  return images;
}

export async function getCategory(id: string) {
  return await pocketbase.collection("categories").getOne<{ name: string }>(id);
}

export async function getProducts(page: number = 0, filter: string = "") {
  return await pocketbase.collection("products").getList<Product>(page, 10, { filter });
}

export async function getProduct(id: string) {
  return await pocketbase.collection("products").getOne<Product>(id);
}
