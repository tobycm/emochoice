import { Carousel } from "@mantine/carousel";
import { Box, Card, Container, Divider, Image, Title } from "@mantine/core";
import classes from "./index.module.css";

export default function Home() {
  return (
    <>
      <Box style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
        <Carousel w={"100%"} loop withIndicators style={{ transform: "translate(0, -5vh)" }}>
          <Carousel.Slide>
            <Image src={"https://emochoice.ca/wp-content/uploads/2022/02/slide-up-01-scaled.jpg"} fit="cover" />
          </Carousel.Slide>
          <Carousel.Slide>
            <Image src={"https://emochoice.ca/wp-content/uploads/2021/10/Slide-Web-02-scaled.jpg"} fit="cover" />
          </Carousel.Slide>
          <Carousel.Slide>
            <Image src={"https://emochoice.ca/wp-content/uploads/2021/10/Slide-Web-0011859-scaled.jpg"} fit="cover" />
          </Carousel.Slide>
        </Carousel>
      </Box>
      <Container style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
        <Divider mb="xl" size="xs" w={"100%"}></Divider>
        <Title order={2} mb="xl">
          Shop by category
        </Title>
        <Box className={classes.cardsBox}>
          <Card shadow="sm" padding="lg" radius="md" withBorder className={classes.card}>
            <Card.Section m={"2%"} h={"20%"}>
              <Title order={3} style={{ textAlign: "center" }}>
                Clothing & Accessories Print
              </Title>
            </Card.Section>
            <Card.Section h={"80%"}>
              <Image
                src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
                height={160}
                alt="Norway"
                maw={"100%"}
                h={"100%"}
              />
            </Card.Section>
          </Card>
          <Card shadow="sm" padding="lg" radius="md" withBorder className={classes.card}>
            <Card.Section m={"2%"} h={"20%"}>
              <Title order={3} style={{ textAlign: "center" }}>
                Digital Printing
              </Title>
            </Card.Section>
            <Card.Section h={"80%"}>
              <Image
                src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
                height={160}
                alt="Norway"
                maw={"100%"}
                h={"100%"}
              />
            </Card.Section>
          </Card>
          <Card shadow="sm" padding="lg" radius="md" withBorder className={classes.card}>
            <Card.Section m={"2%"} h={"20%"}>
              <Title order={3} style={{ textAlign: "center" }}>
                Souvenirs & Gifts Printing
              </Title>
            </Card.Section>
            <Card.Section h={"80%"}>
              <Image
                src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
                height={160}
                alt="Norway"
                maw={"100%"}
                h={"100%"}
              />
            </Card.Section>
          </Card>
        </Box>
        <Divider my="xl" size="xs" w={"100%"}></Divider>
        <Title order={2} mb="xl">
          Gallery
        </Title>
        <Box></Box>
      </Container>
    </>
  );
}
