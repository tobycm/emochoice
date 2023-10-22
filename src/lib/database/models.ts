import { RecordModel } from "pocketbase";

export interface Product extends RecordModel {
  name: string;
  brand?: string;
  category: string[]; // category ids
  description?: string;
  image?: string[]; // filename
  custom_data: Record<string, any> | null;
  expand: {
    category: {
      id: string;
      name: string;
    }[];
  };
}
