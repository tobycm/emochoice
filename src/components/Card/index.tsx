import { Badge, Box, Card, Group, Image, Text, Title, Tooltip } from "@mantine/core";
import pocketbase from "../../lib/database";
import { Product } from "../../lib/database/models";
import { toTitleCase } from "../../lib/utils";
import classes from "./index.module.css";

export default function ProductCard(props: { product: Product }) {
  const { product } = props;
  const productUrl = `/product/${product.id}`;

  return (
    <Card
      href={productUrl}
      component="a"
      style={{ margin: "1vw" }}
      w={"15vw"}
      h={"60vh"}
      miw={250}
      mih={500}
      maw={750}
      mah={1600}
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
    >
      <Card.Section h={"65%"}>
        <Image src={product.image ? pocketbase.getFileUrl(product, product.image[0]) : "/images/no_image.png"} h={"100%"} maw={"100%"} />
      </Card.Section>
      <Card.Section h={"35%"}>
        <Box m={"8%"}>
          <Text mt="md" mb="xs" c={"emochoice-blue"} fw={"bold"}>
            {product.brand}
          </Text>
          <Group justify="space-between">
            <Title order={3} className={classes.title}>
              {product.name}
            </Title>
            {product.badge ? (
              <Badge color="pink" variant="light">
                {product.badge}
              </Badge>
            ) : null}
          </Group>
          {product.category.length > 0 ? (
            <Text mt="xs" style={{ color: "grey" }}>
              Category: {product.expand.category.map((category) => category.name).join(", ")}
            </Text>
          ) : null}
          <Box mt={"xs"} display={"flex"}>
            {product.custom_data?.["colors"]
              ? Object.entries<string>(product.custom_data?.["colors"]).map(([colorName, hex]) => (
                  <Tooltip label={toTitleCase(colorName)} openDelay={500}>
                    <Box w={"2vh"} h={"2vh"} mr={5} style={{ backgroundColor: hex, border: "1px solid grey" }}></Box>
                  </Tooltip>
                ))
              : null}
          </Box>
        </Box>
      </Card.Section>
    </Card>
  );
}
