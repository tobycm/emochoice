import { FC, ReactNode, createContext, useContext, useState } from "react";
import { Product, ProductColor, ProductType } from "./database/models";

export interface Item {
  product: Product;
  quantity: number;
  request: string;
  fileInput?: File | null;
  color?: ProductColor;
  type?: ProductType;
}

export class List extends Array<Item> {
  get total() {
    return this.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
  }
}

const ListContext = createContext<{ list: List; updateList: (newList: List) => void } | undefined>(undefined);

export const ListProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [list, setList] = useState(new List());

  function updateList(newList: List) {
    setList(newList);
  }

  return <ListContext.Provider value={{ list, updateList }}>{children}</ListContext.Provider>;
};

export function useList() {
  const context = useContext(ListContext);
  if (!context) throw new Error("useList must be used within a ListProvider");

  return context;
}
