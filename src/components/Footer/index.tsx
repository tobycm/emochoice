import { Box, Text, Title } from "@mantine/core";
import { IconBrandFacebook, IconBrandInstagram, IconMail, IconMapPin, IconPhone } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import classes from "./index.module.css";

export default function Footer() {
  return (
    <>
      <Box className={classes.footer}>
        <Box className={classes.information}>
          <Title order={4} mb={10}>
            About us
          </Title>
          <Box display={"flex"} style={{ alignItems: "center" }} mb={10}>
            <IconMapPin style={{ color: "black", marginRight: "5px" }} />
            <Link to="https://maps.app.goo.gl/XMkwggAQtaGKr6Jp9" target="_blank" style={{ color: "black", textDecoration: "none" }}>
              <Text ml={5}>Unit 101-737 Main St, Penticton, British Columbia, Canada V2A 5E1</Text>
            </Link>
          </Box>
          <Box display={"flex"} style={{ alignItems: "center" }} mb={10}>
            <IconPhone style={{ color: "black", marginRight: "5px" }} />
            <Text ml={5}>
              Hotline:{" "}
              <Link to="tel:1-778-531-6161" style={{ color: "black", textDecoration: "none" }}>
                +1 (778) 531-6161
              </Link>
            </Text>
          </Box>
          <Box display={"flex"} style={{ alignItems: "center" }} mb={10}>
            <IconMail style={{ color: "black", marginRight: "5px" }} />
            <Text ml={5}>
              Email:{" "}
              <Link to="mailto:sales@emochoice.ca" style={{ color: "black", textDecoration: "none" }}>
                sales@emochoice.ca
              </Link>
            </Text>
          </Box>
        </Box>
        <Box className={classes.information}>
          <Title order={4} mb={15}>
            Connect with us!
          </Title>
          <Box display={"flex"} style={{ alignItems: "center" }}>
            <Link to="https://www.facebook.com/emochoicecanada" target="_blank">
              <IconBrandFacebook style={{ color: "black", scale: "130%", marginRight: "20px" }} />
            </Link>
            <Link to="https://www.instagram.com/emochoicecanada/" target="_blank">
              <IconBrandInstagram style={{ color: "black", scale: "130%", marginRight: "20px" }} />
            </Link>
          </Box>
        </Box>
      </Box>
      <Box className={classes.innerFooter}>
        <Text>
          Copyright © {new Date().getFullYear()} <strong>Emochoice</strong>. All rights reserved.
        </Text>
      </Box>
    </>
  );
}
