import { Carousel, Embla } from "@mantine/carousel";
import { Box, Card, Container, Divider, Image, Title } from "@mantine/core";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getGallery } from "../../lib/database";
import { setDocumentTitle } from "../../lib/utils";
import Gallery from "../Gallery";
import classes from "./index.module.css";

export default function Home() {
  const autoplay = useRef(Autoplay({ delay: 5000 }));
  const [slides, setSlides] = useState<JSX.Element[]>([]);
  const [embla, setEmbla] = useState<Embla | null>(null);

  const reInitEmblas = async () => {
    while (true) {
      try {
        if (embla) embla.reInit();
        break;
      } catch (error) {
        console.error("Error re-initializing emblas:", error);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  };

  useEffect(() => {
    setDocumentTitle();
    const fetchAndSetGallery = async (type: string) => {
      try {
        const gallery = await getGallery(type);
        const slide = gallery.map((link) => (
          <Carousel.Slide key={link}>
            <Image src={link} />
          </Carousel.Slide>
        ));
        setSlides([...slide]);
      } catch (error) {
        console.error(`Error fetching ${type} gallery:`, error);
      }
    };

    Promise.all([fetchAndSetGallery("home_carousel")]).then(() => {
      reInitEmblas();
    });
  }, []);

  return (
    <>
      <Box style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
        <Carousel
          classNames={classes}
          w={"100%"}
          loop
          withIndicators
          getEmblaApi={setEmbla}
          style={{ transform: "translate(0, -5vh)" }}
          plugins={[autoplay.current]}
          onMouseEnter={autoplay.current.stop}
          onMouseLeave={autoplay.current.reset}
        >
          {slides}
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
                  src="https://pocketbase.emochoice.ca/api/files/kt5o377go6qzzct/4qqc2kmr6jysur6/xs_black_RQVawPUdZC.png"
                  height={160}
                  alt="Clothing & Accessories Print"
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
                <Image src="https://m.media-amazon.com/images/I/71oJ2WNty9L.jpg" height={160} alt="Digital Printing" maw={"100%"} h={"100%"} />
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
                  alt="Souvenirs & Gifts Printing"
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
