import { Badge, Box, Card, Group, Image, Text, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Link } from "react-router-dom";
import pocketbase from "../../lib/database";
import { Product } from "../../lib/database/models";

export default function ProductCard(props: { product: Product; inProductPage?: boolean }) {
  const { product } = props;
  const productUrl = `/product/${product.id}`;
  const isMobile = useMediaQuery("(max-width: 49em)");

  return (
    <Link to={productUrl} style={{ textDecoration: "none" }}>
      <Card
        style={{ margin: !props.inProductPage ? "1vw" : "1vw 1vw 0 0" }}
        w={"14.98vw"}
        h={"60vh"}
        miw={280}
        mih={550}
        maw={750}
        mah={1600}
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
      >
        <Card.Section h={"65%"}>
          <Image src={product.images ? pocketbase.getFileUrl(product, product.images[0]) : "/images/no_image.png"} h={"100%"} maw={"100%"} />
        </Card.Section>
        <Card.Section h={"35%"}>
          <Box m={"8%"}>
            <Text mt="md" mb="xs" c={"emochoice-blue"} fw={"bold"}>
              {product.brand}
            </Text>
            <Group justify="space-between">
              <Title order={3}>
                {product.name.length > 32 ? `${isMobile ? product.name.slice(0, 30) : product.name.slice(0, 33)}...` : product.name}
              </Title>
              {product.badge ? (
                <Badge color="pink" variant="light">
                  {product.badge}
                </Badge>
              ) : null}
            </Group>
            {product.expand.category ? (
              <Text mt="xs" style={{ color: "grey" }}>
                Categor{product.expand.category.length === 1 ? "y" : "ies"}: {product.expand.category.map((category) => category.name).join(", ")}
              </Text>
            ) : null}
            {product.expand.colors ? (
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
            ) : null}
          </Box>
        </Card.Section>
      </Card>
    </Link>
  );
}

Card.defaultProps = {
  inProductPage: false,
};
