import PocketBase, { RecordModel } from "pocketbase";
import { DropdownMenuItem, Product, ProductCategory } from "./models";

import Constants from "../constants";

const pocketbase = new PocketBase(Constants.PocketBaseURL);

export default pocketbase;

export async function getGallery(name: string) {
  return await pocketbase.collection("gallery").getFirstListItem<{ pictures: string[] } & RecordModel>(`name = "${name}"`);
}

export async function getFilter(collection: string, id: string) {
  return await pocketbase.collection(collection).getOne(id);
}

export async function searchQuery(collection: string, query: string) {
  return await pocketbase.collection(collection).getFirstListItem<ProductCategory>(`name = "${query}"`);
}

// bad idea but ok
// good idea now
let productsPromise: Promise<Product[]> | undefined;

export async function getProducts() {
  if (!productsPromise)
    productsPromise = pocketbase
      .collection("products")
      .getFullList<Product>(1000, { expand: "category,colors,types,brand,images", sort: "-created" });

  return await productsPromise;
}

export async function getDocument(id: string) {
  return await pocketbase.collection("documents").getOne(id);
}

let dropdownMenuList: DropdownMenuItem[] | undefined;
export async function getDropdownMenuList() {
  if (!dropdownMenuList) dropdownMenuList = await pocketbase.collection("dropdown_menu").getFullList<DropdownMenuItem>({ expand: "parent,children" });
  return dropdownMenuList;
}
