import { Product } from "./database/models";

interface Item {
  product: Product;
  quantity: number;
}

class List extends Array<Item> {
  get total() {
    return this.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
  }
}

const list = new List();

export default list;
