import PocketBase, { RecordModel } from "pocketbase";
import { DropdownMenuItem, Product } from "./models";

import Constants from "../constants";
import { ProductWithKeywords } from "../utils/search";

const pocketbase = new PocketBase(Constants.PocketBaseURL);

export default pocketbase;

export async function getGallery(name: string) {
  return await pocketbase.collection("gallery").getFirstListItem<{ pictures: string[] } & RecordModel>(`name = "${name}"`);
}

export async function getFilter(collection: string, id: string) {
  return await pocketbase.collection(collection).getOne(id);
}

export async function searchQuery<T>(collection: string, query: string) {
  return await pocketbase.collection(collection).getFirstListItem<T>(`name = "${query}"`);
}

export async function getProducts(): Promise<ProductWithKeywords[]> {
  return (await pocketbase.collection("products").getFullList<Product>(1000, { expand: "category,colors,types,brand,images", sort: "-created" })).map(
    (product) => {
      product.keywords =
        `${product.name} ${(product.expand.colors ?? []).map((color) => color.name).join(" ")} ${product.custom_id} ${(product.expand.types ?? []).map((type) => type.name).join(" ")} ${(product.expand.category ?? []).map((category) => category.name).join(" ")} ${product.expand.brand.name}`.toLowerCase();
      return product;
    },
  ) as ProductWithKeywords[];
}

export async function getDocument(id: string) {
  return await pocketbase.collection("documents").getOne(id);
}

export async function getDropdownMenuList() {
  return await pocketbase.collection("dropdown_menu").getFullList<DropdownMenuItem>({ expand: "parent,children" });
}
