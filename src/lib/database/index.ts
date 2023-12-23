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

let products: Product[] | undefined;

export async function getProducts() {
  if (!products) {
    products = await pocketbase.collection("products").getFullList<Product>(1000, { expand: "category,colors", sort: "-created" });
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
      { expand: "category,colors" },
    );
  }

  return products;
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
