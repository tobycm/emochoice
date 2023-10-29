import { Carousel } from "@mantine/carousel";
import { Box, Card, Container, Divider, Image, Title } from "@mantine/core";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { setDocumentTitle } from "../../lib/utils";
import Gallery from "../Gallery";
import classes from "./index.module.css";

export default function Home() {
  const autoplay = useRef(Autoplay({ delay: 5000 }));

  useEffect(() => {
    setDocumentTitle();
  }, []);

  return (
    <>
      <Box style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
        <Carousel
          classNames={classes}
          w={"100%"}
          loop
          withIndicators
          style={{ transform: "translate(0, -5vh)" }}
          plugins={[autoplay.current]}
          onMouseEnter={autoplay.current.stop}
          onMouseLeave={autoplay.current.reset}
        >
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
        <Title order={2} mb="xl" ta="center">
          Shop by category
        </Title>
        <Box className={classes.cardsBox}>
          <Link to="/catalog" className={classes.card}>
            <Card shadow="sm" padding="lg" radius="md" miw={224} withBorder>
              <Card.Section m={"2%"} h={"20%"}>
                <Title order={3} style={{ textAlign: "center" }} c="emochoice-blue">
                  Clothing & Accessories Print
                </Title>
              </Card.Section>
              <Card.Section h={"80%"}>
                <Image
                  src="https://pocketbase.emochoice.ca/api/files/kt5o377go6qzzct/4qqc2kmr6jysur6/toby_hoodie_black_50ONeWz66p.png"
                  height={160}
                  alt="Norway"
                  maw={"100%"}
                  h={"100%"}
                />
              </Card.Section>
            </Card>
          </Link>
          <Link to="/catalog" className={classes.card}>
            <Card shadow="sm" padding="lg" radius="md" miw={224} withBorder>
              <Card.Section m={"2%"} h={"20%"}>
                <Title order={3} style={{ textAlign: "center" }} c="emochoice-blue">
                  Digital Printing
                </Title>
              </Card.Section>
              <Card.Section h={"80%"}>
                <Image src="https://m.media-amazon.com/images/I/71oJ2WNty9L.jpg" height={160} alt="Norway" maw={"100%"} h={"100%"} />
              </Card.Section>
            </Card>
          </Link>
          <Link to="/catalog" className={classes.card}>
            <Card shadow="sm" padding="lg" radius="md" miw={224} withBorder>
              <Card.Section m={"2%"} h={"20%"}>
                <Title order={3} style={{ textAlign: "center" }} c="emochoice-blue">
                  Souvenirs & Gifts Printing
                </Title>
              </Card.Section>
              <Card.Section h={"80%"}>
                <Image
                  src="https://ae01.alicdn.com/kf/Sb073bc137af6492295be9497fcacfc9dG/Hololive-Vtuber-Anime-Figures-Cosplay-Acrylic-Keychain-La-Darknesss-Hoshimachi-Suisei-Gawr-Gura-Nanashi-Mumei-Keyring.jpg"
                  height={160}
                  alt="Norway"
                  maw={"100%"}
                  h={"100%"}
                />
              </Card.Section>
            </Card>
          </Link>
        </Box>
        <Divider my="xl" size="xs" w={"100%"}></Divider>
        <Title order={2} mb="xl">
          Gallery
        </Title>
      </Container>
      <Gallery></Gallery>
    </>
  );
}
