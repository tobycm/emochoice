import { RecordModel } from "pocketbase";

type HexColor = string;
type Filename = string;
type ID = string;

export interface Product extends RecordModel {
  name: string;
  brand: string;
  custom_id: string;
  category: ID[];
  description: string;
  colors: ID[];
  images: Filename[];
  customizable: boolean;
  hidden: boolean;
  tags: string[];
  boundary: string;
  custom_data: unknown | null;
  expand?: {
    category?: ProductCategory[];
    colors?: ProductColor[];
  };
}

export interface ProductCategory extends RecordModel {
  name: string;
}

export interface Color {
  name: string;
  hex: HexColor;
  texture: Filename;
}

export type ProductColor = RecordModel & Color;
