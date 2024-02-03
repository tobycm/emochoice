import { Carousel, Embla } from "@mantine/carousel";
import { Box, Container, Divider, Image, Skeleton, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useRef, useState } from "react";
import DefaultHelmet from "../../components/Helmets/DefaultHelmet";
import HomeCard from "../../components/HomeCard";
import pocketbase, { getGallery, getProducts } from "../../lib/database";
import { setDocumentTitle } from "../../lib/utils";
import Gallery from "../Gallery";
import classes from "./index.module.css";

export default function Home() {
  const autoplay = useRef(Autoplay({ delay: 10000 }));
  const isMobile = useMediaQuery(`(max-width: 48em)`);
  const [slides, setSlides] = useState<ReturnType<typeof Carousel.Slide>[]>([]);
  const [threeCards, setThreeCards] = useState<string[]>([]);
  const [embla, setEmbla] = useState<Embla | null>(null);

  useEffect(() => {
    getGallery("home_carousel").then(async (gallary) => {
      for (const link of gallary.pictures) {
        const index = gallary.pictures.indexOf(link);

        // @ts-ignore when priority in type?
        if (index == 0) await fetch(pocketbase.getFileUrl(gallary, link), { priority: "high" });

        setSlides((prev) => [
          ...prev,
          <Carousel.Slide key={link}>
            <Image src={pocketbase.getFileUrl(gallary, link)} fetchpriority={index == 0 ? "high" : "low"} />
          </Carousel.Slide>,
        ]);
      }

      // preload products
      getProducts();

      while (true) {
        try {
          if (embla) embla.reInit();
          break;
        } catch {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    });

    getGallery("3_cards").then((gallary) => setThreeCards(gallary.pictures.map((link) => pocketbase.getFileUrl(gallary, link, { thumb: "0x350" }))));
  }, [embla]);

  useEffect(() => {
    setDocumentTitle();

    const fetchAndSetGallery = async () => {
      try {
        const gallery = await getGallery("home_carousel");
        const newSlides: ReturnType<typeof Carousel.Slide>[] = [];
        for (const link of gallery.pictures) {
          const index = gallery.pictures.indexOf(link);
          // @ts-ignore when priority in type?
          if (index == 0) await fetch(pocketbase.getFileUrl(gallery, link), { priority: "high" });
          newSlides.push(
            <Carousel.Slide key={link}>
              <Image src={pocketbase.getFileUrl(gallery, link)} fetchpriority={index == 0 ? "high" : "low"} />
            </Carousel.Slide>,
          );
        }
        await setSlides(newSlides);
      } catch (error) {
        // do nothing
      }
    };

    fetchAndSetGallery();

    getGallery("3_cards").then((gallery) => setThreeCards(gallery.pictures.map((link) => pocketbase.getFileUrl(gallery, link, { thumb: "0x350" }))));
  }, []);

  return (
    <>
      <Box style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
        <DefaultHelmet />
        <Skeleton
          visible={slides.length == 0}
          height={slides.length == 0 ? (isMobile ? 125 : 547) : "100%"}
          style={{ transform: "translate(0, -5vh)" }}
        >
          <Carousel
            w={"100%"}
            loop
            withIndicators
            plugins={[autoplay.current]}
            onMouseEnter={autoplay.current.stop}
            onMouseLeave={autoplay.current.reset}
          >
            {slides}
          </Carousel>
        </Skeleton>
      </Box>
      <Container style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
        <Divider mb="xl" size="xs" w={"100%"}></Divider>
        <Title order={1} mb="xl" ta="center">
          Shop by category
        </Title>
        <Box className={classes.cardsBox}>
          <HomeCard name={"Clothing & Accessories Print"} image={threeCards[0]} key={"Clothing & Accessories Print"} id={"hksx1e8gqajlaaq"} />
          <HomeCard name={"Digital Printing"} image={threeCards[1]} key={"Digital Printing"} id={"l13znpfe1k6yuj6"} />
          <HomeCard name={"Souvenirs & Gifts Printing"} image={threeCards[2]} key={"Souvenirs & Gifts Printing"} id={"kt45aqsnscvtqt5"} />
        </Box>
        <Divider my="xl" size="xs" w={"100%"}></Divider>
      </Container>
      <Gallery home={true} />
    </>
  );
}
