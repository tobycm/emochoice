import { Box, Card, Image, Skeleton, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Link } from "react-router-dom";
import classes from "./index.module.css";

export default function HomeCard({ name, image, id }: { name: string; image: string; id: string }) {
  const isMobile = useMediaQuery("(max-width: 1000px)");

  if (isMobile)
    return (
      <Skeleton className={classes.card} h="calc(1/2*80vw)" mah="300px" maw="600px" w="80vw" radius="md" visible={!image}>
        <Link to={`/catalog?filters=category:${id}`} className={classes.card}>
          <Card shadow="sm" radius="md" w="80vw" h="calc(1/2*80vw)" maw="600px" mah="300px" withBorder>
            <Card.Section>
              <Box display={"flex"}>
                <Box w="40%">
                  <Image
                    src={image}
                    alt={`${name}`}
                    h="calc(1/2*80vw)"
                    mah="300px"
                    // @ts-ignore update later
                    fetchpriority="high"
                  />
                </Box>
                <Box w="60%" display="flex">
                  <Title order={3} style={{ textAlign: "center" }} m="auto" p={10} c="emochoice-blue">
                    {name}
                  </Title>
                </Box>
              </Box>
            </Card.Section>
          </Card>
        </Link>
      </Skeleton>
    );

  return (
    <Skeleton className={classes.card} h={456} w={280} radius="md" visible={!image}>
      <Link to={`/catalog?filters=category:${id}`} className={classes.card}>
        <Card shadow="sm" radius="md" w={280} h={456} withBorder>
          <Card.Section h={"17%"} m="4%">
            <Title order={3} style={{ textAlign: "center" }} c="emochoice-blue">
              {name}
            </Title>
          </Card.Section>
          <Card.Section h="83%">
            <Image src={image} alt={`${name}`} maw={"100%"} h={"100%"} />
          </Card.Section>
        </Card>
      </Link>
    </Skeleton>
  );
}
