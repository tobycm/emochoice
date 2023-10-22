import { Box, Container, NumberInput, Table, Text, Title } from "@mantine/core";
import { IconShoppingCartSearch, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../../lib/database";
import list from "../../lib/list";

export default function List() {
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    getProducts().then((products) => {
      products.items.forEach((product) => {
        const existingItem = list.find((item) => item.product.id === product.id);
        if (!existingItem) {
          list.push({ product, quantity: 1 });
        }
      });
      setIsDataLoaded(true);
    });
  }, []);

  return (
    <Container style={{ display: "flex", flexDirection: "column", alignItems: "center" }} mih={"50vh"}>
      <Title order={2} mb={20}>
        My List
      </Title>
      {isDataLoaded ? (
        list && list.length > 0 ? (
          <Table verticalSpacing="md" highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th>Color</Table.Th>
                <Table.Th>Size</Table.Th>
                <Table.Th>Quantity</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {list.map((item, index) => (
                <Table.Tr key={index}>
                  <Table.Td>{item.product.name}</Table.Td>
                  <Table.Td></Table.Td>
                  <Table.Td></Table.Td>
                  <Table.Td>
                    <Box display="flex" style={{ alignItems: "center" }}>
                      <NumberInput w={"12%"} miw={70} mr={10} clampBehavior="strict" min={1} max={99} />
                      <IconX style={{ color: "red" }} stroke={1.234}></IconX>
                    </Box>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        ) : (
          <Box style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <IconShoppingCartSearch style={{ width: "30%", height: "30%", marginBottom: "1em" }} stroke={1} />
            <Text>
              Nothing here yet.{" "}
              {
                <Link to="/catalog" style={{ color: "black" }}>
                  Browse
                </Link>
              }{" "}
              and start adding items to the list!
            </Text>
          </Box>
        )
      ) : null}
    </Container>
  );
}
