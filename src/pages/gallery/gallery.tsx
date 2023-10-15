import { Carousel } from "@mantine/carousel";
import { Box, Container, Image, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { getGallery } from "../../lib/database";
import classes from "./gallery.module.css";

export default function Gallery() {
  const [gallery, setGallery] = useState<string[]>([]);

  useEffect(() => {
    getGallery("tobycm").then((gallery) => setGallery(gallery));
  }, []);

  const slides = gallery.map((link) => (
    <Carousel.Slide key={link}>
      <Image src={link} />
    </Carousel.Slide>
  ));

  const [eggunogallery, setEgguNoGallery] = useState<string[]>([]);

  useEffect(() => {
    getGallery("eggu").then((gallery) => setEgguNoGallery(gallery));
  }, []);

  const eggunoslides = eggunogallery.map((link) => (
    <Carousel.Slide key={link}>
      <Image src={link} />
    </Carousel.Slide>
  ));

  return (
    <Container style={{ alignItems: "center" }}>
      <Box
        mb={20}
        display={"flex"}
        style={{ flexDirection: "column", alignItems: "center" }}
      >
        <Title order={2} mb={20}>
          tobycm
        </Title>
        <Carousel
          className={classes.carousel}
          mx="auto"
          withIndicators
          slideSize="70%"
          slideGap="md"
        >
          {slides}
        </Carousel>
      </Box>
      <Box
        mb={20}
        display={"flex"}
        style={{ flexDirection: "column", alignItems: "center" }}
      >
        <Title order={2} mb={20}>
          eggu
        </Title>
        <Carousel
          className={classes.carousel}
          style={{ maxWidth: "40vw" }}
          mx="auto"
          withIndicators
          slideSize="70%"
          slideGap="md"
        >
          {eggunoslides}
        </Carousel>
      </Box>
    </Container>
  );
}
