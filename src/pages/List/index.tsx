import { Container, Text, Title } from "@mantine/core";
import { useEffect } from "react";
import { getProducts } from "../../lib/database";
import list from "../../lib/list";

export default function List() {
  useEffect(() => {
    getProducts().then((products) => {
      products.items.forEach((product) => {
        list.push({ product, quantity: 1 });
      });
    });
  }, []);

  return (
    <Container style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Title order={2} mb={20}>
        My List
      </Title>
      {list.length > 0 ? list.map((item, index) => <Text key={index}>{item.product.name}</Text>) : <Text>Nothing here yet.</Text>}
    </Container>
  );
}
