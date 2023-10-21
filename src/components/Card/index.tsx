import { Badge, Box, Card, Group, Image, Text, Title } from "@mantine/core";
import pocketbase from "../../lib/database";
import { Product } from "../../lib/database/models";
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
      mih={400}
      maw={750}
      mah={1600} // very good ratio
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      // yea make the box taller, remember to have a good ratio, dont make it tooooooo tall
    >
      <Card.Section h={"65%"}>
        <Image src={product.image ? pocketbase.getFileUrl(product, product.image) : "/images/no_image.png"} h={"100%"} maw={"100%"} />
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
          {product.category ? (
            <Text mt="xs" style={{ color: "grey" }}>
              Category: {product.category.join(", ")}
            </Text>
          ) : null}
          <Box mt={"xs"}>
            {product.custom_data?.["colors"]
              ? Object.values<string>(product.custom_data?.["colors"]).map((hex) => <Box w={"2vw"} h={"2vh"} style={{ backgroundColor: hex }}></Box>)
              : null}
          </Box>
        </Box>
      </Card.Section>
    </Card>
  );
}
