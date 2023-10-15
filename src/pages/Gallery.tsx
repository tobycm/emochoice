import { Carousel } from "@mantine/carousel";
import { Image } from "@mantine/core";
import { useEffect, useState } from "react";
import { getGallery } from "../lib/database";

export default function Gallery() {
  const [gallery, setGallery] = useState<string[]>([]); // image links

  useEffect(() => {
    getGallery("tobycm").then((gallery) => setGallery(gallery));
  }, []);

  const slides = gallery.map((link) => (
    <Carousel.Slide key={link}>
      <Image src={link} />
    </Carousel.Slide>
  ));

  return (
    <Carousel style={{ maxWidth: 500 }} mx="auto" withIndicators height={200}>
      {slides}
    </Carousel>
  );
}
