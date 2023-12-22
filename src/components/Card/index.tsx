import { Badge, Box, Card, Group, Image, Text, Title } from "@mantine/core";
import { Link } from "react-router-dom";
import pocketbase from "../../lib/database";
import { Product } from "../../lib/database/models";

export default function ProductCard(props: { product: Product; inProductPage?: boolean }) {
  const { product } = props;
  const productUrl = `/product/${product.id}`;

  let colors = null;

  if (product.expand?.colors) {
    colors = (
      <Box mt={"xs"} display={"flex"} style={{ alignItems: "center" }}>
        {product.expand.colors.slice(0, 9).map((color) => (
          <Box
            w={"2vh"}
            h={"2vh"}
            mr={5}
            mih={15}
            miw={15}
            style={{ backgroundColor: color.hex, border: "1px solid #777", borderRadius: "3px" }}
          ></Box>
        ))}
        {product.expand.colors.length > 9 ? <Text c="grey">+{product.expand.colors.length - 9}</Text> : null}
      </Box>
    );
  }

  return (
    <Link to={productUrl} style={{ textDecoration: "none" }}>
      <Card
        style={{ margin: !props.inProductPage ? "1vw" : "0.3vw 0.3vw 0 0" }}
        w={"14.98vw"}
        h={"60vh"}
        miw={280}
        mih={550}
        maw={750}
        mah={1600}
        shadow="sm"
        padding="lg"
        radius="md"
        pb="xl"
        mb="md"
        withBorder
      >
        <Card.Section h={"76%"}>
          <Image src={product.images ? pocketbase.getFileUrl(product, product.images[0]) : "/images/no_image.png"} h={"100%"} maw={"100%"} />
        </Card.Section>
        <Card.Section h={"24%"}>
          <Box m={"8%"}>
            <Text mt="md" mb="xs" c={"emochoice-blue"} fw={"bold"}>
              {product.brand}
            </Text>
            <Group justify="space-between">
              <Title order={3}>{product.name.length > 32 ? `${product.name.slice(0, 30)}...` : product.name}</Title>
              {product.badge ? (
                <Badge color="pink" variant="light">
                  {product.badge}
                </Badge>
              ) : null}
            </Group>
            {colors}
          </Box>
        </Card.Section>
      </Card>
    </Link>
  );
}

ProductCard.defaultProps = {
  inProductPage: false,
};
