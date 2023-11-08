import { Carousel, Embla } from "@mantine/carousel";
import { Box, Image, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { getGallery } from "../../lib/database";
import LoaderBox, { setDocumentTitle, toTitleCase } from "../../lib/utils";
import classes from "./index.module.css";

export default function Gallery() {
  const [embla, setEmbla] = useState<{ [key: string]: Embla | null }>({
    hoodies: null,
    keychains: null,
    posters: null,
  });
  const [slides, setSlides] = useState<{ [key: string]: JSX.Element[] }>({
    hoodies: [],
    keychains: [],
    posters: [],
  });

  const isMobile = useMediaQuery(`(max-width: 48em)`);

  const reInitEmblas = async () => {
    while (true) {
      try {
        if (embla.hoodies) embla.hoodies.reInit();
        if (embla.keychains) embla.keychains.reInit();
        if (embla.posters) embla.posters.reInit();
        break;
      } catch (error) {
        console.error("Error re-initializing emblas:", error);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  };

  useEffect(() => {
    const fetchAndSetGallery = async (type: string) => {
      try {
        const gallery = await getGallery(type);
        const slides = gallery.map((link) => (
          <Carousel.Slide key={link}>
            <Image src={link} />
          </Carousel.Slide>
        ));
        setSlides((prevSlides) => ({ ...prevSlides, [type]: slides }));
      } catch (error) {
        console.error(`Error fetching ${type} gallery:`, error);
      }
    };

    if (window.location.href.includes("/gallery")) setDocumentTitle("Gallery");

    Promise.all([fetchAndSetGallery("hoodies"), fetchAndSetGallery("keychains"), fetchAndSetGallery("posters")]).then(() => {
      reInitEmblas();
    });
  }, [embla]);

  if (!slides.hoodies.length || !slides.keychains.length || !slides.posters.length) {
    return <LoaderBox />;
  }

  return (
    <>
      {["hoodies", "keychains", "posters"].map((type) => (
        <Box mb={20} display={"flex"} style={{ flexDirection: "column", alignItems: "center" }} key={type} mih="50vh">
          <Title order={2} mb="xl" c="emochoice-blue">
            {toTitleCase(type)}
          </Title>
          <Carousel
            className={classes.carousel}
            getEmblaApi={(api) => setEmbla((prevEmbla) => ({ ...prevEmbla, [type]: api }))}
            mx="auto"
            loop
            draggable
            slideSize={isMobile ? "100%" : "30%"}
            slideGap="sm"
            mb="xl"
          >
            {slides[type]}
          </Carousel>
        </Box>
      ))}
    </>
  );
}
