import { Carousel, Embla, useAnimationOffsetEffect } from "@mantine/carousel";
import { Box, Image } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { getGallery } from "../../lib/database";
import { setDocumentTitle } from "../../lib/utils";
import classes from "./index.module.css";

export default function Gallery() {
  const [gallery, setGallery] = useState<string[]>([]);
  const [eggunogallery, setEgguNoGallery] = useState<string[]>([]);
  const [embla, setEmbla] = useState<Embla | null>(null);

  useAnimationOffsetEffect(embla, 750);

  useEffect(() => {
    setDocumentTitle("Gallery");
    getGallery("tobycm").then((gallery) => setGallery(gallery));
    getGallery("eggu").then((gallery) => setEgguNoGallery(gallery));
  }, []);

  const slides = gallery.map((link) => (
    <Carousel.Slide key={link}>
      <Image src={link} />
    </Carousel.Slide>
  ));

  const eggunoslides = eggunogallery.map((link) => (
    <Carousel.Slide key={link}>
      <Image src={link} />
    </Carousel.Slide>
  ));

  return (
    <Box mb={20} display={"flex"} style={{ flexDirection: "column", alignItems: "center" }} mih="50vh">
      {/* <Carousel
        className={classes.carousel}
        getEmblaApi={setEmbla}
        mx="auto"
        loop
        draggable
        slideSize={useMediaQuery(`(max-width: 48em)`) ? "100%" : "30%"}
        slideGap="sm"
        mb="xl"
      >
        {slides}
      </Carousel> */}
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
        {eggunoslides}
      </Carousel>
    </Box>
  );
}
