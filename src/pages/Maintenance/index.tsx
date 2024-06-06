import { Box, Container, Divider, Flex, Image, Text, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconMail, IconMapPin, IconPhone } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import classes from "./index.module.css";

export default function Maintenance() {
  const isMobile = useMediaQuery("(max-width: 48em)");

  return (
    <Container mt="xl" display={"flex"} miw="400px" pl="sm" pr="sm" style={{ flexDirection: "column", alignItems: "center" }}>
      <Image src="/images/maintenance.svg" w="50%" miw="400px" alt="Maintenance" mb="xl" />
      <Title order={1} ta="center">
        WE ARE DOWN FOR MAINTENANCE
      </Title>
      <Text mt="xl" ta="center">
        The webstore is undergoing maintenance and will be back soon.
      </Text>
      <Divider my="xl" size="sm" w="100%"></Divider>
      <Title ta="center" order={3}>
        Meet us in-person at
      </Title>
      <Flex mt="xl" direction={isMobile ? "column" : "row"}>
        <Box>
          <Flex align="center" mb={10}>
            <IconMapPin className={classes.icon} />
            <Text ml={5}>
              <Link to="https://maps.app.goo.gl/XMkwggAQtaGKr6Jp9" target="_blank" style={{ color: "black", textDecoration: "none" }}>
                Unit 101-737 Main St, Penticton, British Columbia, Canada V2A 5E1
              </Link>
            </Text>
          </Flex>
          <Flex align="center" mb={10}>
            <IconPhone className={classes.icon} />
            <Text ml={5}>
              Hotline:{" "}
              <Link to="tel:1-778-531-6161" style={{ color: "black", textDecoration: "none" }}>
                +1 (778) 531-6161
              </Link>
            </Text>
          </Flex>
          <Flex align="center" mb={10}>
            <IconMail className={classes.icon} />
            <Text ml={5}>
              Email:{" "}
              <Link to="mailto:sales@emochoice.ca" style={{ color: "black", textDecoration: "none" }}>
                sales@emochoice.ca
              </Link>
            </Text>
          </Flex>
        </Box>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2591.5775601812793!2d-119.59203682298623!3d49.49248627142508!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54826353ea4cc04b%3A0x8f64bf2deb6375fd!2sEmochoice%20Canada!5e0!3m2!1sen!2sus!4v1697402584985!5m2!1sen!2sus"
          loading="lazy"
          style={{
            border: 0,
            width: isMobile ? "100%" : "60%",
            minHeight: isMobile ? "300px" : "280px",
            marginTop: isMobile ? "20px" : "0px",
            marginLeft: isMobile ? "0px" : "10px",
          }}
        ></iframe>
      </Flex>
      <Divider my="xl" size="sm" w={"100%"}></Divider>
      <Image src="/images/full_logo.svg" w="30%" alt="Logo" mb="lg" miw="250px" />
      <Link
        style={{ color: "black", textDecoration: "none" }}
        to="https://www.freepik.com/free-vector/forming-team-leadership-concept-illustration_29980173.htm"
        target="_blank"
      >
        <Text mb="xl">
          Image by <strong>storyset</strong> on freepik
        </Text>
      </Link>
    </Container>
  );
}
