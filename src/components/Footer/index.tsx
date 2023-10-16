import { Box, Text, ThemeIcon, Title } from "@mantine/core";
import { IconBrandFacebook, IconBrandInstagram, IconMail, IconMapPin, IconPhone } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import classes from "./index.module.css";

export default function Footer() {
  return (
    <>
      <Box className={classes.footer}>
        <Box className={classes.information}>
          <Title order={4} mb={7}>
            About us
          </Title>
          <Box display={"flex"} style={{ alignItems: "center" }} mb={3}>
            <ThemeIcon color="light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))">
              <IconMapPin style={{ width: "120%", color: "black" }} />
            </ThemeIcon>
            <Text ml={5}>
              <Link to={"https://maps.app.goo.gl/16tGjRFdEP8ecdr27"} target="_blank">
                Unit 101-737 Main St, Penticton, British Columbia, Canada V2A 5E1
              </Link>
            </Text>
          </Box>
          <Box display={"flex"} style={{ alignItems: "center" }} mb={3}>
            <ThemeIcon color="light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))">
              <IconPhone style={{ width: "120%", color: "black" }} />
            </ThemeIcon>
            <Text ml={5}>
              Hotline: <Link to="tel:1-778-531-6161">+1 (778) 531-6161</Link>
            </Text>
          </Box>
          <Box display={"flex"} style={{ alignItems: "center" }} mb={3}>
            <ThemeIcon color="light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))">
              <IconMail style={{ width: "120%", color: "black" }} />
            </ThemeIcon>
            <Text ml={5}>
              Email: <Link to="mailto:sales@emochoice.ca">sales@emochoice.ca</Link>
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
