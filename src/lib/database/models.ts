import { RecordModel } from "pocketbase";

type HexColor = string;
type Filename = string;
type ID = string;

export interface Product extends RecordModel {
  name: string;
  brand: string;
  category: ID;
  description: string;
  images: Filename[];
  custom_data: {
    sizes?: string[];
    colors?: { [name: string]: HexColor };
    upload_image?: boolean;
  } | null;
  expand: {
    category: {
      id: string;
      name: string;
    }[];
  };
}
