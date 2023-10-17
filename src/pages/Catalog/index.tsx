import { Container } from "@mantine/core";
import { ListResult } from "pocketbase";
import { useEffect, useState } from "react";
import ProductCard from "../../components/Card";
import pocketbase, { getProducts } from "../../lib/database";
import { Product } from "../../lib/database/models";
import classes from "./index.module.css";

export default function Catalog() {
  const [products, setProducts] = useState<ListResult<Product>>();

  useEffect(() => {
    (async () => {
      const products = await getProducts(); // all products

      setProducts(products);
    })();
  }, []);

  return (
    <Container className={classes.container}>
      {products?.items.map((product) => {
        return (
          <ProductCard
            id={product.id}
            image={product.image ? pocketbase.getFileUrl(product, product.image) : undefined}
            brand={product.brand}
            name={product.name}
          />
        );
      })}
    </Container>
  );
}
