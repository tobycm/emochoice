import { Box, Text, ThemeIcon, Title } from "@mantine/core";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconMail,
  IconMapPin,
  IconPhone,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";
import classes from "./footer.module.css";

export default function Footer() {
  return (
    <>
      <Box className={classes.footer}>
        <Box className={classes.information}>
          <Title order={4} mb={7}>
            About us
          </Title>
          <Box display={"flex"} style={{ alignItems: "center" }} mb={3}>
            <ThemeIcon
              color="light-dark(
    var(--mantine-color-gray-0),
    var(--mantine-color-dark-6)
  )"
            >
              <IconMapPin style={{ width: "120%", color: "black" }} />
            </ThemeIcon>
            <Text ml={5}>
              Unit 101-737 Main St, Penticton, British Columbia, Canada V2A 5E1
            </Text>
          </Box>
          <Box display={"flex"} style={{ alignItems: "center" }} mb={3}>
            <ThemeIcon
              color="light-dark(
    var(--mantine-color-gray-0),
    var(--mantine-color-dark-6)
  )"
            >
              <IconPhone style={{ width: "120%", color: "black" }} />
            </ThemeIcon>
            <Text ml={5}>
              Hotline:{" "}
              <a
                href="tel:1-778-531-6161"
                style={{ color: "black", textDecoration: "none" }}
              >
                +1 778 531 6161
              </a>
            </Text>
          </Box>
          <Box display={"flex"} style={{ alignItems: "center" }} mb={3}>
            <ThemeIcon
              color="light-dark(
    var(--mantine-color-gray-0),
    var(--mantine-color-dark-6)
  )"
            >
              <IconMail style={{ width: "120%", color: "black" }} />
            </ThemeIcon>
            <Text ml={5}>
              Email:{" "}
              <a
                href="mailto:sales@emochoice.ca"
                style={{ color: "black", textDecoration: "none" }}
              >
                sales@emochoice.ca
              </a>
            </Text>
          </Box>
        </Box>
        <Box className={classes.information}>
          <Title order={4} mb={15}>
            Connect with us!
          </Title>
          <Box display={"flex"} style={{ alignItems: "center" }}>
            <Link to="https://www.facebook.com/emochoicecanada" target="_blank">
              <IconBrandFacebook
                style={{ color: "black", scale: "130%", marginRight: "20px" }}
              />
            </Link>
            <Link
              to="https://www.instagram.com/emochoicecanada/"
              target="_blank"
            >
              <IconBrandInstagram
                style={{ color: "black", scale: "130%", marginRight: "20px" }}
              />
            </Link>
          </Box>
        </Box>
      </Box>
      <Box className={classes.innerFooter}>
        <Text>
          Copyright © {new Date().getFullYear()} <strong>EmoChoice</strong>. All
          rights reserved.
        </Text>
      </Box>
    </>
  );
}
