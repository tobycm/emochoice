import PocketBase, { RecordService } from "pocketbase";
import { Document, DropdownMenuItem, Product, ProductBrand, ProductCategory, ProductColor, ProductImage } from "./models";

import Constants from "../constants";
import { ProductWithKeywords } from "../utils/search";

interface TypedPocketBase extends PocketBase {
  collection(idOrName: string): RecordService; // default fallback for any other collection
  collection(idOrName: "brands"): RecordService<ProductBrand>;
  collection(idOrName: "categories"): RecordService<ProductCategory>;
  collection(idOrName: "colors"): RecordService<ProductColor>;
  collection(idOrName: "documents"): RecordService<Document>;
  collection(idOrName: "dropdown_menu"): RecordService<DropdownMenuItem>;
  collection(idOrName: "gallery"): RecordService<{ pictures: string[] }>;
  collection(idOrName: "images"): RecordService<ProductImage>;
  collection(idOrName: "products"): RecordService<Product>;
}

const pocketbase = new PocketBase(Constants.PocketBaseURL) as TypedPocketBase;

export default pocketbase;

export async function getGallery(name: string) {
  return await pocketbase.collection("gallery").getFirstListItem(`name = "${name}"`);
}

export async function getProducts(): Promise<ProductWithKeywords[]> {
  return (await pocketbase.collection("products").getFullList(1000, { expand: "category,colors,types,brand,images", sort: "-created" })).map(
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
  return await pocketbase.collection("dropdown_menu").getFullList({ expand: "parent,children" });
}
