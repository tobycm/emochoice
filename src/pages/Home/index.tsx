import { Carousel, Embla } from "@mantine/carousel";
import { Box, Card, Container, Divider, Image, Title } from "@mantine/core";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import DefaultHelmet from "../../components/Helmets/DefaultHelmet";
import { getGallery } from "../../lib/database";
import { setDocumentTitle } from "../../lib/utils";
import Gallery from "../Gallery";
import classes from "./index.module.css";

export default function Home() {
  const autoplay = useRef(Autoplay({ delay: 5000 }));
  const [slides, setSlides] = useState<JSX.Element[]>([]);
  const [threeCards, setThreeCards] = useState<string[]>([]);
  const [embla, setEmbla] = useState<Embla | null>(null);

  useEffect(() => {
    setDocumentTitle();
    const fetchAndSetGallery = async (type: string) => {
      try {
        const gallery = await getGallery(type);
        const slide = gallery.map((link) => (
          <Carousel.Slide key={link}>
            <Image src={link + "?thumb=1903x546"} />
          </Carousel.Slide>
        ));
        setSlides([...slide]);
      } catch (error) {
        console.error(`Error fetching ${type} gallery:`, error);
      }
    };

    fetchAndSetGallery("home_carousel").then(async () => {
      // eslint-disable-next-line no-constant-condition
      while (true) {
        try {
          if (embla) embla.reInit();
          break;
        } catch (error) {
          console.error("Error re-initializing emblas:", error);
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    });

    const setHomeCards = async () => {
      const images = await getGallery("3_cards");
      setThreeCards(images.map((image) => image + "?thumb=375x477")); // check this out lol
    };

    setHomeCards();
  }, [embla]);

  return (
    <>
      <Box style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
        <DefaultHelmet />
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
        <Title order={1} mb="xl" ta="center">
          Shop by category
        </Title>
        <Box className={classes.cardsBox}>
          <Link to="/catalog" state={{ categories: ["Clothing & Accessories Print"] }} className={classes.card}>
            <Card shadow="sm" radius="md" w={270} h={456} withBorder>
              <Card.Section h={"20%"} m="4%">
                <Title order={3} style={{ textAlign: "center" }} c="emochoice-blue">
                  Clothing & Accessories Print
                </Title>
              </Card.Section>
              <Card.Section>
                <Image src={threeCards[0]} alt="Clothing & Accessories Print" maw={"100%"} h={"100%"} />
              </Card.Section>
            </Card>
          </Link>
          <Link to="/catalog" state={{ categories: ["Digital Printing"] }} className={classes.card}>
            <Card shadow="sm" radius="md" w={270} h={456} withBorder>
              <Card.Section h={"20%"} m="4%">
                <Title order={3} style={{ textAlign: "center" }} c="emochoice-blue">
                  Digital Printing
                </Title>
              </Card.Section>
              <Card.Section>
                <Image src={threeCards[1]} alt="Digital Printing" maw={"100%"} h={"100%"} />
              </Card.Section>
            </Card>
          </Link>
          <Link to="/catalog" state={{ categories: ["Souvenirs & Gifts Printing"] }} className={classes.card}>
            <Card shadow="sm" radius="md" w={270} h={456} withBorder>
              <Card.Section h={"20%"} m="4%">
                <Title order={3} style={{ textAlign: "center" }} c="emochoice-blue">
                  Souvenirs & Gifts Printing
                </Title>
              </Card.Section>
              <Card.Section>
                <Image src={threeCards[2]} alt="Souvenirs & Gifts Printing" maw={"100%"} h={"100%"} />
              </Card.Section>
            </Card>
          </Link>
        </Box>
        <Divider my="xl" size="xs" w={"100%"}></Divider>
      </Container>
      <Gallery home={true} />
    </>
  );
}
