import { Carousel, Embla } from "@mantine/carousel";
import { Box, Image, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";
import SmallChangeHelmet from "../../components/Helmets/SmallChangeHelmet";
import { getGallery } from "../../lib/database";
import LoaderBox, { setDocumentTitle } from "../../lib/utils";
import classes from "./index.module.css";

export default function Gallery(props: { home: boolean }) {
  const [embla, setEmbla] = useState<{ [key: string]: Embla | null }>({
    gallery_1: null,
    gallery_2: null,
    gallery_3: null,
  });
  const [slides, setSlides] = useState<{ [key: string]: JSX.Element[] }>({
    gallery_1: [],
    gallery_2: [],
    gallery_3: [],
  });

  const isMobile = useMediaQuery(`(max-width: 48em)`);

  const reInitEmblas = async () => {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        if (embla.gallery_1) embla.gallery_1.reInit();
        if (embla.gallery_2) embla.gallery_2.reInit();
        if (embla.gallery_3) embla.gallery_3.reInit();
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
          <Carousel.Slide w={75} key={link}>
            <Image w={150} style={{ aspectRatio: 1 / 1 }} src={link} />
          </Carousel.Slide>
        ));
        setSlides((prevSlides) => ({ ...prevSlides, [type]: slides }));
      } catch (error) {
        console.error(`Error fetching ${type} gallery:`, error);
      }
    };

    if (window.location.href.includes("/gallery")) setDocumentTitle("Gallery");

    Promise.all([fetchAndSetGallery("gallery_1"), fetchAndSetGallery("gallery_2"), fetchAndSetGallery("gallery_3")]).then(() => {
      reInitEmblas();
    });
  }, [embla]);

  if (!slides.gallery_1.length || !slides.gallery_2.length || !slides.gallery_3.length) return <LoaderBox />;

  return (
    <Box display="flex" style={{ flexDirection: "column", alignItems: "center" }}>
      {!props.home ? (
        <SmallChangeHelmet title="Gallery" gallery={true} location="gallery" description="Take a look at some of our great printing products!" />
      ) : null}
      <Title order={2} mb="xl">
        Gallery
      </Title>
      {["gallery_1", "gallery_2", "gallery_3"].map((type) => (
        <Box mb={1} display={"flex"} style={{ flexDirection: "column", alignItems: "center" }} key={type} mih={100}>
          <Title order={3} c="emochoice-blue" mb="md">
            {type === "gallery_1" ? "Clothing & Accessories" : type === "gallery_2" ? "Digital Printing" : "Souvenirs & Gifts Printing"}
          </Title>
          <Carousel
            className={classes.carousel}
            getEmblaApi={(api) => setEmbla((prevEmbla) => ({ ...prevEmbla, [type]: api }))}
            loop
            draggable
            dragFree
            slideSize={isMobile ? "100%" : "30%"}
            mb="xs"
          >
            {slides[type]}
          </Carousel>
        </Box>
      ))}
    </Box>
  );
}

Gallery.defaultProps = {
  home: false,
};
