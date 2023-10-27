import { Carousel, Embla, useAnimationOffsetEffect } from "@mantine/carousel";
import { Box, Image, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { getGallery } from "../../lib/database";
import { setDocumentTitle } from "../../lib/utils";
import classes from "./index.module.css";

export default function Gallery() {
  const [hoodiesGallery, setHoodiesGallery] = useState<string[]>([]);
  const [keychainsGallery, setKeychainsNoGallery] = useState<string[]>([]);
  const [postersGallery, setPostersNoGallery] = useState<string[]>([]);
  const [embla, setEmbla] = useState<Embla | null>(null);

  useAnimationOffsetEffect(embla, 750);

  useEffect(() => {
    setDocumentTitle("Gallery");
    getGallery("hoodies").then((gallery) => setHoodiesGallery(gallery));
    getGallery("keychains").then((gallery) => setKeychainsNoGallery(gallery));
    getGallery("posters").then((gallery) => setPostersNoGallery(gallery));
  }, []);

  const hoodiesSlides = hoodiesGallery.map((link) => (
    <Carousel.Slide key={link}>
      <Image src={link} />
    </Carousel.Slide>
  ));

  const keychainsSlides = keychainsGallery.map((link) => (
    <Carousel.Slide key={link}>
      <Image src={link} />
    </Carousel.Slide>
  ));

  const postersSlides = postersGallery.map((link) => (
    <Carousel.Slide key={link}>
      <Image src={link} />
    </Carousel.Slide>
  ));

  return (
    <Box mb={20} display={"flex"} style={{ flexDirection: "column", alignItems: "center" }} mih="50vh">
      {["Hoodies", "Keychains", "Posters"].map((slides) => (
        <>
          <Title order={2} mb="xl" c="emochoice-blue">
            {slides}
          </Title>
          <Carousel
            className={classes.carousel}
            getEmblaApi={setEmbla}
            mx="auto"
            loop
            draggable
            slideSize={useMediaQuery(`(max-width: 48em)`) ? "100%" : "30%"}
            slideGap="sm"
            mb="xl"
          >
            {slides === "Hoodies" ? hoodiesSlides : slides === "Keychains" ? keychainsSlides : postersSlides}
          </Carousel>
        </>
      ))}
    </Box>
  );
}
