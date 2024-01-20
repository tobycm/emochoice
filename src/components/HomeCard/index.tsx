import { Box, Card, Image, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Link } from "react-router-dom";
import classes from "./index.module.css";

export default function HomeCard(props: { name: string; image: string }) {
  const isMobile = useMediaQuery("(max-width: 972px)");

  if (isMobile)
    return (
      <Link to={`/catalog?filters=category:${props.name}`} className={classes.card}>
        <Card shadow="sm" radius="md" w="80vw" h="calc(1/2*80vw)" maw="600px" mah="300px" withBorder>
          <Card.Section>
            <Box display={"flex"}>
              <Box w="40%">
                <Image src={props.image} alt={`${props.name}`} h="calc(1/2*80vw)" mah="300px" />
              </Box>
              <Box w="60%" display="flex">
                <Title order={3} style={{ textAlign: "center" }} m="auto" p={5} c="emochoice-blue">
                  {props.name}
                </Title>
              </Box>
            </Box>
          </Card.Section>
        </Card>
      </Link>
    );

  return (
    <Link to={`/catalog?filters=category:${props.name}`} className={classes.card}>
      <Card shadow="sm" radius="md" w={270} h={456} withBorder>
        <Card.Section h={"20%"} m="4%">
          <Title order={3} style={{ textAlign: "center" }} c="emochoice-blue">
            {props.name}
          </Title>
        </Card.Section>
        <Card.Section>
          <Image src={props.image} alt={`${props.name}`} maw={"100%"} h={"100%"} />
        </Card.Section>
      </Card>
    </Link>
  );
}
