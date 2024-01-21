import { Carousel, Embla } from "@mantine/carousel";
import { Box, Container, Divider, Image, Skeleton, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useRef, useState } from "react";
import DefaultHelmet from "../../components/Helmets/DefaultHelmet";
import HomeCard from "../../components/HomeCard";
import { getGallery, searchCategory } from "../../lib/database";
import { setDocumentTitle } from "../../lib/utils";
import Gallery from "../Gallery";
import classes from "./index.module.css";

export default function Home() {
  const autoplay = useRef(Autoplay({ delay: 5000 }));
  const isMobile = useMediaQuery(`(max-width: 48em)`);
  const [slides, setSlides] = useState<ReturnType<typeof Carousel.Slide>[]>([]);
  const [threeCards, setThreeCards] = useState<string[]>([]);
  const [embla, setEmbla] = useState<Embla | null>(null);
  const [categoryIDList, setCategoryIDList] = useState<Record<string, string>[]>([]);

  useEffect(() => {
    getGallery("home_carousel").then(async (links) => {
      for (const link of links) {
        const index = links.indexOf(link);

        // @ts-ignore update later
        if (index == 0) await fetch(link, { priority: "high" });

        setSlides((prev) => [
          ...prev,
          <Carousel.Slide key={link}>
            <Image
              src={link}
              // @ts-ignore update later
              fetchpriority={index == 0 ? "high" : "low"}
            />
          </Carousel.Slide>,
        ]);
      }

      while (true) {
        try {
          if (embla) embla.reInit();
          break;
        } catch {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    });

    getGallery("3_cards", { thumb: "0x350" }).then(setThreeCards);
  }, [embla]);

  useEffect(() => {
    setDocumentTitle();

    const fetchIDs = async () => {
      ["Clothing & Accessories Print", "Digital Printing", "Souvenirs & Gifts Printing"].forEach(async (name) => {
        const id = (await searchCategory(decodeURIComponent(name))).id;
        setCategoryIDList((prev) => [
          ...prev,
          {
            name,
            id,
          },
        ]);
      });
    };

    fetchIDs();
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
            classNames={classes}
            w={"100%"}
            loop
            withIndicators
            getEmblaApi={setEmbla}
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
          {categoryIDList.map((category, index) => (
            <HomeCard name={category.name} image={threeCards[index]} key={index} id={category.id} />
          ))}
        </Box>
        <Divider my="xl" size="xs" w={"100%"}></Divider>
      </Container>
      <Gallery home={true} />
    </>
  );
}
