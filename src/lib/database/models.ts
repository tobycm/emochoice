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
  types: ID[];
  images: Filename[];
  customizable: boolean;
  hidden: boolean;
  tags: string[];
  boundary: string;
  custom_data: Record<string, string>;
  expand?: {
    category?: ProductCategory[];
    colors?: ProductColor[];
    types?: ProductType[];
  };
}

export interface DropdownMenuItem extends RecordModel {
  parent: ID;
  children: ID[];
  expand?: {
    parent?: ProductCategory;
    children?: ProductCategory[];
  };
}

export interface Type {
  name: string;
}

export type ProductType = RecordModel & Type;

export interface ProductCategory extends RecordModel {
  name: string;
}

export interface Color {
  name: string;
  hex: HexColor;
  texture: Filename;
}

export type ProductColor = RecordModel & Color;
