import { Badge, Box, Card, Group, Image, Text } from "@mantine/core";
import { Link } from "react-router-dom";
import pocketbase from "../../lib/database";
import { Product } from "../../lib/database/models";

export default function ProductCard(props: { product: Product; inProductPage?: boolean }) {
  const { product } = props;
  const productUrl = `/product/${product.id}`;
  // const isMobile = useMediaQuery("(max-width: 36em)");

  let colors = null;

  if (product.expand?.colors) {
    colors = (
      <Box display={"flex"} style={{ alignItems: "center" }}>
        {product.expand.colors.slice(0, 7).map((color) => (
          <Box w={"1.618vh"} mr={5} style={{ backgroundColor: color.hex, border: "1px solid #777", borderRadius: "3px", aspectRatio: 1 / 1 }}></Box>
        ))}
        {product.expand.colors.length > 7 ? <Text c="grey">+{product.expand.colors.length - 7}</Text> : null}
      </Box>
    );
  }

  return (
    <Link to={productUrl} style={{ textDecoration: "none" }}>
      <Card
        style={{ margin: !props.inProductPage ? "1vw 0 1vw 1vw" : "0.3vw 0.3vw 0 0", aspectRatio: 1 / 1.618 }}
        w={"43rem/3"}
        maw={750}
        mah={1600}
        shadow="sm"
        padding="lg"
        radius="md"
        pb="xl"
        mb="md"
        withBorder
      >
        <Card.Section h={"77%"}>
          <Image src={product.images ? pocketbase.getFileUrl(product, product.images[0]) : "/images/no_image.png"} h={"100%"} maw={"100%"} />
        </Card.Section>
        <Card.Section h={"23%"}>
          <Box m={"5%"}>
            <Box display="flex" style={{ justifyContent: "space-between" }}>
              <Text c={"emochoice-blue"} style={{ fontSize: "13px" }} fw={600}>
                {product.brand}
              </Text>
              <Box display="flex">
                {/* <Badge color="red" size="sm">
                  On Sale
                </Badge> */}
                {product.custom_id && (
                  <Badge ml={5} color="emochoice-blue" size="sm">
                    {product.custom_id}
                  </Badge>
                )}
              </Box>
            </Box>
            <Group justify="space-between">
              <Text lineClamp={2} mt={3} mb={5} fw="600" style={{ fontSize: "17px" }}>
                {product.name}
              </Text>
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
