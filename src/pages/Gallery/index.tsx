import { Carousel, Embla } from "@mantine/carousel";
import { Box, Image, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";
import SmallChangeHelmet from "../../components/Helmets/SmallChangeHelmet";
import ImageZoom from "../../components/ImageZoom";
import pocketbase, { getGallery } from "../../lib/database";
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

  const [zoomImage, setZoomImage] = useState<string>("");
  const [bigImage, openBigImage] = useState(false);
  const [scrollHeight, setScrollHeight] = useState(0);

  const reInitEmblas = async () => {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        if (embla.gallery_1) embla.gallery_1.reInit();
        if (embla.gallery_2) embla.gallery_2.reInit();
        if (embla.gallery_3) embla.gallery_3.reInit();
        break;
      } catch {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  };

  useEffect(() => {
    const fetchAndSetGallery = async (type: string) => {
      try {
        const gallary = await getGallery(type);
        const slides = gallary.pictures.map((link, index) => (
          <Carousel.Slide w="60%" key={link} mb="xl">
            <Box w="100%" mr={!isMobile ? 5 : 0} ml={!isMobile ? 5 : 0}>
              <Image
                onClick={() => {
                  if (isMobile) return;
                  setZoomImage(pocketbase.getFileUrl(gallary, link));
                  openBigImage(true);
                }}
                w={isMobile ? "80vw" : "250px"}
                ml="auto"
                mr="auto"
                style={{ aspectRatio: "calc(9/11)", cursor: "pointer" }}
                src={pocketbase.getFileUrl(gallary, link, { thumb: "600x0" })}
                fetchpriority={index == 0 ? "high" : "low"}
              />
            </Box>
          </Carousel.Slide>
        ));
        setSlides((prevSlides) => ({ ...prevSlides, [type]: slides }));
      } catch {
        // do nothing
      }
    };

    if (window.location.href.includes("/gallery")) setDocumentTitle("Gallery");

    Promise.all([fetchAndSetGallery("gallery_1"), fetchAndSetGallery("gallery_2"), fetchAndSetGallery("gallery_3")]).then(() => {
      reInitEmblas();
    });
  }, [embla]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollHeight(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  if (!slides.gallery_1.length || !slides.gallery_2.length || !slides.gallery_3.length)
    return (
      <Box display="flex" style={{ flexDirection: "column", alignItems: "center" }}>
        <Title ta="center" order={1} mb="lg">
          Gallery
        </Title>
        <LoaderBox />
      </Box>
    );

  return (
    <Box display="flex" style={{ flexDirection: "column", alignItems: "center" }}>
      {bigImage && !isMobile && (
        <ImageZoom scrollHeight={scrollHeight} productImage={zoomImage} openBigImage={openBigImage} setProductImage={setZoomImage} />
      )}
      {!props.home && (
        <SmallChangeHelmet title="Gallery" gallery={true} location="gallery" description="Take a look at some of our great printing products!" />
      )}
      <Title ta="center" order={1} mb="lg">
        Gallery
      </Title>
      {["gallery_1", "gallery_2", "gallery_3"].map((type) => (
        <Box mb={1} display={"flex"} style={{ flexDirection: "column", alignItems: "center" }} key={type} mih={100}>
          <Title ta="center" order={2} c="emochoice-blue" mb="md">
            {type === "gallery_1" ? "Clothing & Accessories Printing" : type === "gallery_2" ? "Digital Printing" : "Souvenirs & Gifts Printing"}
          </Title>
          <Carousel
            w="80vw"
            loop
            className={classes.carousel}
            getEmblaApi={(api) => setEmbla((prevEmbla) => ({ ...prevEmbla, [type]: api }))}
            draggable
            slideSize={isMobile ? "100%" : "15%"}
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
