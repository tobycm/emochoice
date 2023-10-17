import { Badge, Card, Container, Group, Image, Text } from "@mantine/core";

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
      <Card href={productUrl} target="_blank" component="a" style={{ margin: "2vw" }}>
        <Card.Section>
          <Image src={image ?? "/images/no_image.png"} h={"100%"} w={"15vw"} miw={200} />
        </Card.Section>
        <Group justify="space-between" mt="md" mb="xs">
          <Text fw={"bold"}>{brand}</Text>
          {badge ? (
            <Badge color="pink" variant="light">
              {badge}
            </Badge>
          ) : null}
        </Group>
        <Text>{name}</Text>
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
