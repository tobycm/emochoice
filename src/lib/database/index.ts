import PocketBase, { RecordModel } from "pocketbase";
import { DropdownMenuItem, Product } from "./models";

import Constants from "../constants";

const pocketbase = new PocketBase(Constants.PocketBaseURL);

export default pocketbase;

export async function getGallery(name: string) {
  return await pocketbase.collection("gallery").getFirstListItem<{ pictures: string[] } & RecordModel>(`name = "${name}"`);
}

let products: Product[] | undefined;

export async function getProducts() {
  if (!products) {
    products = await pocketbase.collection("products").getFullList<Product>(1000, { expand: "category,colors,types,brand", sort: "-created" });
    pocketbase.collection("products").subscribe<Product>(
      "*",
      (event) => {
        switch (event.action) {
          case "create":
            products!.unshift(event.record);
            break;
          case "update":
            products = products!.map((product) => (product.id === event.record.id ? event.record : product));
            break;
          case "delete":
            products = products!.filter((product) => product.id !== event.record.id);
            break;
        }
      },
      { expand: "category,colors,types,brand" },
    );
  }

  return products;
}

export async function getDocument(id: string) {
  return await pocketbase.collection("documents").getOne(id);
}

let dropdownMenuList: DropdownMenuItem[] | undefined;
export async function getDropdownMenuList() {
  if (!dropdownMenuList) dropdownMenuList = await pocketbase.collection("dropdown_menu").getFullList<DropdownMenuItem>({ expand: "parent,children" });
  return dropdownMenuList;
}
