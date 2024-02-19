import { Box, Container, Divider, Skeleton, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";
import Banner from "../../components/Banner";
import DefaultHelmet from "../../components/Helmets/DefaultHelmet";
import HomeCard from "../../components/HomeCard";
import pocketbase, { getGallery } from "../../lib/database";
import { setDocumentTitle } from "../../lib/utils";
import Gallery from "../Gallery";
import classes from "./index.module.css";

export default function Home() {
  const isMobile = useMediaQuery("(max-width: 48em)");
  const [threeCards, setThreeCards] = useState<string[]>([]);
  const [bannersLoaded, setBannersLoaded] = useState(false);

  useEffect(() => {
    getGallery("3_cards").then((gallery) => setThreeCards(gallery.pictures.map((link) => pocketbase.getFileUrl(gallery, link, { thumb: "0x350" }))));
  }, []);

  useEffect(() => {
    setDocumentTitle();
  }, []);

  return (
    <Box>
      <Box style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
        <DefaultHelmet />
        <Skeleton visible={!bannersLoaded} height={isMobile ? "20vh" : "30vh"} style={{ transform: "translate(0, -5vh)" }}>
          <Banner onLoad={() => setBannersLoaded(true)} />
        </Skeleton>
      </Box>
      <Container style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
        <Divider mb="xl" size="xs" w={"100%"}></Divider>
        <Title order={1} mb="xl" ta="center">
          Shop by category
        </Title>
        <Box className={classes.cardsBox}>
          <HomeCard name={"Clothing & Accessories Printing"} image={threeCards[0]} key={0} id={"hksx1e8gqajlaaq"} />
          <HomeCard name={"Digital Printing"} image={threeCards[1]} key={1} id={"l13znpfe1k6yuj6"} />
          <HomeCard name={"Souvenirs & Gifts Printing"} image={threeCards[2]} key={2} id={"kt45aqsnscvtqt5"} />
        </Box>
        <Divider my="xl" size="xs" w={"100%"}></Divider>
      </Container>
      <Gallery home={true} />
    </Box>
  );
}
