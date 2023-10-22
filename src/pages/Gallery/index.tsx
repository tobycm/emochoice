import { Carousel } from "@mantine/carousel";
import { Box, Image } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { getGallery } from "../../lib/database";
import classes from "./index.module.css";

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
    <Box style={{ alignItems: "center" }}>
      <Box mb={20} display={"flex"} style={{ flexDirection: "column", alignItems: "center" }}>
        {/* <Title order={2} mb={20}>
          tobycm
        </Title> */}
        <Carousel
          className={classes.carousel}
          mx="auto"
          loop
          draggable
          dragFree
          slideSize={useMediaQuery(`(max-width: 48em)`) ? "100%" : "30%"}
          slideGap="sm"
        >
          {slides}
        </Carousel>
      </Box>
      <Box mb={20} display={"flex"} style={{ flexDirection: "column", alignItems: "center" }}>
        {/* <Title order={2} mb={20}>
          eggu
        </Title> */}
        <Carousel
          className={classes.carousel}
          mx="auto"
          loop
          draggable
          dragFree
          slideSize={useMediaQuery(`(max-width: 48em)`) ? "100%" : "30%"}
          slideGap="sm"
        >
          {eggunoslides}
        </Carousel>
      </Box>
    </Box>
  );
}
