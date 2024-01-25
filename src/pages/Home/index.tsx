import { Carousel, Embla } from "@mantine/carousel";
import { Box, Container, Divider, Image, Skeleton, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useRef, useState } from "react";
import DefaultHelmet from "../../components/Helmets/DefaultHelmet";
import HomeCard from "../../components/HomeCard";
import pocketbase, { getGallery, searchCategory } from "../../lib/database";
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

    const fetchIDs = async () => {
      ["Clothing & Accessories Printing", "Digital Printing", "Souvenirs & Gifts Printing"].forEach(async (name, index) => {
        const id = (await searchCategory(decodeURIComponent(name))).id;
        setCategoryIDList((prev) => [
          ...prev,
          {
            name,
            index: index.toString(),
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
          {categoryIDList
            .sort((a, b) => parseInt(a.index) - parseInt(b.index))
            .map((category) => (
              <HomeCard name={category.name} image={threeCards[parseInt(category.index)]} key={category.index} id={category.id} />
            ))}
        </Box>
        <Divider my="xl" size="xs" w={"100%"}></Divider>
      </Container>
      <Gallery home={true} />
    </>
  );
}
