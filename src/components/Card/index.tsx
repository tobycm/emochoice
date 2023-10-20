import { Badge, Box, Card, Container, Group, Image, Text, Title } from "@mantine/core";
import classes from "./index.module.css";

export default function ProductCard(props: {
  id: string;
  name: string;
  image?: string;
  brand?: string;
  colors?: string[];
  sizes?: string[];
  badge?: string;
}) {
  const { id, image, brand, name, colors, sizes, badge } = props;

  const productUrl = `/product/${id}`;

  return (
    <Container>
      <Card
        href={productUrl}
        component="a"
        style={{ margin: "1vw" }}
        w={"5vw"}
        h={"40vh"}
        miw={250}
        mih={400}
        maw={750}
        mah={1200}
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
      >
        <Card.Section h={"65%"}>
          <Image src={image ?? "/images/no_image.png"} w={"100%"} mah={"100%"} />
        </Card.Section>
        <Card.Section h={"35%"}>
          <Box m={"8%"}>
            <Text mt="md" mb="xs" style={{ color: "#228be6" }} fw={"bold"}>
              {brand}
            </Text>
            <Group justify="space-between">
              <Title order={3} className={classes.title}>
                {name}
              </Title>
              {badge ? (
                <Badge color="pink" variant="light">
                  {badge}
                </Badge>
              ) : null}
            </Group>
            <Text mt="xs" style={{ color: "grey" }}>
              Category: {brand}
            </Text>
          </Box>
        </Card.Section>
      </Card>
    </Container>

    // <Box
    //   style={{ height: "100%", width: "20%", margin: "3vw" }}
    //   onClick={() => {
    //     console.log("Clicked on card");
    //   }}
    //   key={id}
    // >
    //   <Box h={"27%"} mah={}>
    //     <Image src={image ?? "/images/no_image.png"} />
    //   </Box>
    //   <Text style={{ fontWeight: "bold" }}>{brand ?? "No brand"}</Text>
    //   <Text>{name}</Text>
    // </Box>
  );
}
