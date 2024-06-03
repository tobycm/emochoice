import { Box, Container, Divider, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import Banner from "../../components/Banner";
import DefaultHelmet from "../../components/Helmets/DefaultHelmet";
import HomeCard from "../../components/HomeCard";
import pocketbase, { getGallery } from "../../lib/database";
import LoaderBox, { setDocumentTitle } from "../../lib/utils";
import Gallery from "../Gallery";
import classes from "./index.module.css";

export default function Home() {
  const threeCards = useQuery({
    queryKey: ["3_cards"],
    queryFn: async () => {
      const gallary = await getGallery("3_cards");
      return gallary.pictures.map((link) => pocketbase.getFileUrl(gallary, link, { thumb: "0x350" }));
    },
  });

  useEffect(() => {
    setDocumentTitle();
  }, []);

  if (threeCards.isFetching) return <LoaderBox text="Loading..." />;

  if (threeCards.isError) return <LoaderBox text="Error loading data. Please refresh!" />;

  if (!threeCards.data) return <LoaderBox text="No data found!" />; // This should never happen

  return (
    <Box>
      <Box style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
        <DefaultHelmet />
        <Banner />
      </Box>
      <Container style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
        <Divider mb="xl" size="xs" w={"100%"}></Divider>
        <Title order={1} mb="xl" ta="center">
          Shop by category
        </Title>
        <Box className={classes.cardsBox}>
          <HomeCard name={"Clothing & Accessories Printing"} image={threeCards.data[0]} key={0} id={"hksx1e8gqajlaaq"} />
          <HomeCard name={"Digital Printing"} image={threeCards.data[1]} key={1} id={"l13znpfe1k6yuj6"} />
          <HomeCard name={"Souvenirs & Gifts Printing"} image={threeCards.data[2]} key={2} id={"kt45aqsnscvtqt5"} />
        </Box>
        <Divider my="xl" size="xs" w={"100%"}></Divider>
      </Container>
      <Gallery home={true} />
    </Box>
  );
}
