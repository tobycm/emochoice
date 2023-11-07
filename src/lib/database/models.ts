import { RecordModel } from "pocketbase";

export type PocketBaseJSON = unknown | null;

type HexColor = string;
type Filename = string;
type ID = string;

export interface Product extends RecordModel {
  name: string;
  brand: string;
  category: ID[];
  description: string;
  colors: ID[];
  images: Filename[];
  boundary: string;
  custom_data: PocketBaseJSON;
  expand: {
    category?: ProductCategory[];
    colors?: ProductColor[];
  };
}

interface ProductCategory extends RecordModel {
  name: string;
}

export interface Color {
  name: string;
  hex: HexColor;
}

export type ProductColor = RecordModel & Color;
