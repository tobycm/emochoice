import { RecordModel } from "pocketbase";

type HexColor = string;
type Filename = string;
type ID = string;
type HTML = string;

export interface Product extends RecordModel {
  name: string;
  brand: ID;
  custom_id: string;
  category: ID[];
  description: string;
  colors: ID[];
  types: ID[];
  images: ID[];
  customizable: boolean;
  hidden: boolean;
  tags: string[];
  boundary: string;
  custom_data: Record<string, string>;
  expand: {
    brand: ProductBrand; // required
    category?: ProductCategory[];
    colors?: ProductColor[];
    types?: ProductType[];
    images?: ProductImage[];
  };
}

export interface Brand {
  name: string;
}

export type ProductBrand = RecordModel & Brand;

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

export interface Image {
  image: Filename;
  color: ID;
  type: ID;
}

export type ProductImage = RecordModel & Image;

export interface Document extends RecordModel {
  title: string;
  content: HTML;
}
