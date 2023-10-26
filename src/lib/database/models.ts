import { RecordModel } from "pocketbase";

type HexColor = string;
type Filename = string;
type ID = string;

export interface Product extends RecordModel {
  name: string;
  brand: string;
  category: ID[];
  description: string;
  sizes: string; // comma separated
  colors: ID[];
  images: Filename[];
  boundary: string;
  custom_data: unknown;
  expand: {
    category?: ProductCategory[];
    colors?: ProductColor[];
  };
}

interface ProductCategory extends RecordModel {
  name: string;
}

export default interface ProductColor extends RecordModel {
  name: string;
  hex: HexColor;
}
