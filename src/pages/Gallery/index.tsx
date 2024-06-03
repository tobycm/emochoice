import { Carousel, Embla } from "@mantine/carousel";
import { Box, Flex, Image, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconInfoCircle } from "@tabler/icons-react";
import Autoplay from "embla-carousel-autoplay";
import { JSX, useEffect, useRef, useState } from "react";
import SmallChangeHelmet from "../../components/Helmets/SmallChangeHelmet";
import ImageZoom from "../../components/ImageZoom";
import pocketbase, { getGallery } from "../../lib/database";
import LoaderBox, { setDocumentTitle } from "../../lib/utils";
import classes from "./index.module.css";

export default function Gallery({ home = false }: { home?: boolean }) {
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
  const [tapAlert, setTapAlert] = useState(true);

  const autoplays = [useRef(Autoplay({ delay: 2000 })), useRef(Autoplay({ delay: 2000 })), useRef(Autoplay({ delay: 2000 }))];

  const reInitEmblas = async () => {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        if (embla.gallery_1) embla.gallery_1.reInit();
        if (embla.gallery_2) embla.gallery_2.reInit();
        if (embla.gallery_3) embla.gallery_3.reInit();
        if (autoplays[0].current) autoplays[0].current.reset();
        if (autoplays[1].current) autoplays[1].current.reset();
        if (autoplays[2].current) autoplays[2].current.reset();
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
                  if (isMobile) {
                    window.open(pocketbase.getFileUrl(gallary, link), "_blank");
                    return;
                  }
                  setZoomImage(pocketbase.getFileUrl(gallary, link));
                  openBigImage(true);
                }}
                w={isMobile ? "80vw" : "250px"}
                ml="auto"
                mr="auto"
                style={{ aspectRatio: "calc(9/11)", cursor: "pointer" }}
                src={pocketbase.getFileUrl(gallary, link, { thumb: "0x600" })}
                fetchPriority={index == 0 ? "high" : "low"}
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
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollPosition = window.scrollY;

      setScrollHeight(scrollPosition);

      if (!isMobile || !window.location.href.includes("/gallery")) return;
      if (scrollPosition > documentHeight / 3 - windowHeight / 3 && tapAlert) {
        notifications.show({
          title: "Tap on an image to view it in full size!",
          message: "You can also swipe left and right to view more images.",
          color: "emochoice-green",
          autoClose: 10000,
          icon: <IconInfoCircle />,
        });
        setTapAlert(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  if (!slides.gallery_1.length || !slides.gallery_2.length || !slides.gallery_3.length)
    return (
      <Flex direction="column" align="center">
        <Title ta="center" order={1} mb="lg">
          Gallery
        </Title>
        <LoaderBox />
      </Flex>
    );

  const stopAllAutoplays = () => {
    [0, 1, 2].map((i) => {
      autoplays[i].current.stop();
    });
  };

  const startAllAutoplays = () => {
    [0, 1, 2].map((i) => {
      autoplays[i].current.reset();
    });
  };

  return (
    <Flex direction="column" align="center">
      {bigImage && !isMobile && (
        <ImageZoom scrollHeight={scrollHeight} productImage={zoomImage} openBigImage={openBigImage} setProductImage={setZoomImage} />
      )}
      {!home && <SmallChangeHelmet title="Gallery" gallery location="gallery" description="Take a look at some of our great printing products!" />}
      <Title ta="center" order={1} mb="lg">
        Gallery
      </Title>
      {["gallery_1", "gallery_2", "gallery_3"].map((type, index) => (
        <Flex mb={1} direction="column" align="center" key={type} mih={100}>
          <Title ta="center" order={2} c="emochoice-blue" mb="md" mr="md" ml="md">
            {["Clothing & Accessories Printing", "Digital Printing", "Souvenirs & Gifts Printing"][index]}
          </Title>
          <Carousel
            w="80vw"
            loop
            className={classes.carousel}
            plugins={home ? [autoplays[index].current] : []}
            onMouseEnter={home ? stopAllAutoplays : undefined}
            onMouseLeave={home ? startAllAutoplays : undefined}
            getEmblaApi={(api) => setEmbla((prevEmbla) => ({ ...prevEmbla, [type]: api }))}
            draggable
            slideSize={isMobile ? "100%" : "15%"}
            mb="xs"
          >
            {slides[type]}
          </Carousel>
        </Flex>
      ))}
    </Flex>
  );
}
