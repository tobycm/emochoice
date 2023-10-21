import { Box } from "@mantine/core";
import { ListResult } from "pocketbase";
import { useEffect, useState } from "react";
import ProductCard from "../../components/Card";
import { getCategory, getProducts } from "../../lib/database";
import { Product } from "../../lib/database/models";
import classes from "./index.module.css";

export default function Catalog() {
  const [products, setProducts] = useState<ListResult<Product>>();

  useEffect(() => {
    (async () => {
      const products = await getProducts(); // all products

      const items: Product[] = [];
      for (const product of products.items) {
        const category: string[] = [];
        for (const categoryId of product.category) category.push((await getCategory(categoryId)).name);
        product.category = category;

        items.push(product);
      }
      products.items = items;

      setProducts(products);
    })();
  }, []);

  return (
    <Box className={classes.container}>
      {products?.items.map((product) => {
        return <ProductCard product={product} />;
      })}
    </Box>
  );
}
