import { Badge, Box, Card, Center, Group, Image, Overlay, Text, Title } from "@mantine/core";
import { Link } from "react-router-dom";
import pocketbase from "../../lib/database";
import { Product } from "../../lib/database/models";
import { linearBackgroundProperties } from "../../lib/utils";

export default function ProductCard(props: { product: Product; inProductPage?: boolean; isMobile?: boolean }) {
  const { product, isMobile } = props;
  const productUrl = `/product/${product.id}`;

  let colors = null;

  if (product.expand?.colors) {
    colors = (
      <Box display={"flex"} style={{ alignItems: "center" }} mih={24.8}>
        {product.expand.colors.slice(0, 8).map((color) => (
          <Box
            w="15px"
            h="15px"
            mr={5}
            style={{ background: linearBackgroundProperties(color), border: "1px solid #777", borderRadius: "3px", aspectRatio: 1 / 1 }}
          ></Box>
        ))}
        {product.expand.colors.length > 8 && <Text c="grey">+{product.expand.colors.length - 8}</Text>}
      </Box>
    );
  }

  if (isMobile && !props.inProductPage)
    return (
      <Link to={productUrl} style={{ textDecoration: "none" }}>
        <Card w="85vw" h="calc(4/10*85vw)" maw={750} mah={1600} shadow="sm" padding="sm" radius="md" pb="xl" mb="lg" display={"flex"} withBorder>
          <Card.Section display={"flex"}>
            <Box w="30%">
              <Image
                src={
                  product.images
                    ? pocketbase.getFileUrl(product.expand.images![0], product.expand.images![0].image, { thumb: "0x320" })
                    : "/images/no_image.png"
                }
                h="calc(4/10*85vw)"
              />
              {product.tags.includes("out_of_stock") && (
                <Overlay w="30%" backgroundOpacity={0.4}>
                  <Center h="100%" w="100%">
                    <Title order={2} ta="center" c="white">
                      Out of Stock
                    </Title>
                  </Center>
                </Overlay>
              )}
            </Box>
            <Box w="70%">
              <Box m={"4%"}>
                <Box display="flex" style={{ justifyContent: "space-between" }}>
                  <Text c={"emochoice-blue"} style={{ fontSize: "13px" }} fw={600} lineClamp={1}>
                    {product.expand.brand.name}
                  </Text>
                  <Box display="flex">
                    {product.tags.includes("on_sale") && (
                      <Badge color="red" size="sm">
                        On Sale
                      </Badge>
                    )}
                    {product.custom_id && (
                      <Badge ml={5} color="emochoice-blue" size="sm">
                        {product.custom_id}
                      </Badge>
                    )}
                  </Box>
                </Box>
                <Group justify="space-between">
                  <Text lineClamp={2} mt={1} mb={3} fw="600" style={{ fontSize: "17px" }}>
                    {product.name}
                  </Text>
                </Group>
                {colors}
              </Box>
            </Box>
          </Card.Section>
        </Card>
      </Link>
    );

  return (
    <Link to={productUrl} style={{ textDecoration: "none" }}>
      <Card
        style={{ margin: !props.inProductPage ? "1vw 0 1vw 1vw" : "0.3vw 0.3vw 0 0" }}
        w={`43rem/3`}
        h={`${((1 + Math.sqrt(5)) / 2) * (43 / 3)}rem`}
        maw={750}
        mah={1600}
        shadow="sm"
        padding="lg"
        radius="md"
        mb={props.inProductPage ? "md" : "0"}
        pb="xl"
        mr={props.inProductPage ? "10" : "0"}
        withBorder
      >
        <Card.Section h="77%">
          <Image
            src={
              product.images
                ? pocketbase.getFileUrl(product.expand.images![0], product.expand.images![0].image, { thumb: "0x320" })
                : "/images/no_image.png"
            }
            h="100%"
          />
          {product.tags.includes("out_of_stock") && (
            <Overlay h="66.15%" backgroundOpacity={0.4}>
              <Center h="100%">
                <Title order={2} ta="center" c="white">
                  Out of Stock
                </Title>
              </Center>
            </Overlay>
          )}
        </Card.Section>
        <Card.Section>
          <Box m={"5%"}>
            <Box display="flex" style={{ justifyContent: "space-between" }}>
              <Text c={"emochoice-blue"} style={{ fontSize: "13px" }} fw={600} lineClamp={1}>
                {product.expand.brand.name}
              </Text>
              <Box display="flex">
                {product.tags.includes("on_sale") && (
                  <Badge color="red" size="sm">
                    On Sale
                  </Badge>
                )}
                {product.custom_id && (
                  <Badge ml={5} color="emochoice-blue" size="sm">
                    {product.custom_id}
                  </Badge>
                )}
              </Box>
            </Box>
            <Group justify="space-between">
              <Text lineClamp={2} mt={5} mb={5} fw="600" style={{ fontSize: "17px" }}>
                {product.name}
              </Text>
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
