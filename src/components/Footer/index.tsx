import { Box, Flex, Text, Title } from "@mantine/core";
import { IconBrandFacebook, IconBrandInstagram, IconMail, IconMapPin, IconPhone } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import classes from "./index.module.css";

export default function Footer() {
  return (
    <>
      <Box className={classes.footer}>
        <Box className={classes.information}>
          <Title order={4} fw={600} mb={15}>
            Contact us
          </Title>
          <Flex align="center" mb={10}>
            <IconMapPin className={classes.icon} />
            <Text ml={5}>
              <Link to="https://maps.app.goo.gl/Vwju44b3tc5xqpjN9" target="_blank" style={{ color: "#485665", textDecoration: "none" }}>
                327 Martin Street, Penticton, BC V2A 5K7
              </Link>
            </Text>
          </Flex>
          <Flex align="center" mb={10}>
            <IconPhone className={classes.icon} />
            <Text ml={5} c="#485665">
              Hotline:{" "}
              <Link to="tel:1-778-531-6161" style={{ color: "#485665", textDecoration: "none" }}>
                +1 (778) 531-6161
              </Link>
            </Text>
          </Flex>
          <Flex align="center" mb={10}>
            <IconMail className={classes.icon} />
            <Text ml={5} c="#485665">
              Email:{" "}
              <Link to="mailto:sales@emochoice.ca" style={{ color: "#485665", textDecoration: "none" }}>
                sales@emochoice.ca
              </Link>
            </Text>
          </Flex>
        </Box>
        <Box className={classes.information}>
          <Title order={4} fw={600} mb={15}>
            Support
          </Title>
          <Flex direction="column">
            <Link to="/shopping-guide" style={{ marginBottom: "10px", textDecoration: "none", color: "#485665" }}>
              Shopping Guide
            </Link>
            <Link to="/terms-of-service" style={{ marginBottom: "10px", textDecoration: "none", color: "#485665" }}>
              Terms of Service
            </Link>
          </Flex>
        </Box>
        <Box className={classes.information}>
          <Title order={4} fw={600} mb={15}>
            Policy
          </Title>
          <Flex direction="column">
            <Link to="/privacy-policy" style={{ marginBottom: "10px", textDecoration: "none", color: "#485665" }}>
              Privacy Policy
            </Link>
            <Link to="/payment-policy" style={{ marginBottom: "10px", textDecoration: "none", color: "#485665" }}>
              Payment Policy
            </Link>
            <Link to="/shipping-policy" style={{ marginBottom: "10px", textDecoration: "none", color: "#485665" }}>
              Shipping Policy
            </Link>
            <Link to="/return-policy" style={{ marginBottom: "10px", textDecoration: "none", color: "#485665" }}>
              Return Policy
            </Link>
          </Flex>
        </Box>
        <Box className={classes.information}>
          <Title order={4} fw={600} mb={15}>
            Connect with us!
          </Title>
          <Flex align="center">
            <Link to="https://www.facebook.com/emochoicecanada" target="_blank" style={{ marginRight: "20px" }}>
              <IconBrandFacebook style={{ color: "#485665" }} size={30} />
            </Link>
            <Link to="https://www.instagram.com/emochoicecanada/" target="_blank" style={{ marginRight: "20px" }}>
              <IconBrandInstagram style={{ color: "#485665" }} size={30} />
            </Link>
          </Flex>
        </Box>
      </Box>
      <Box className={classes.innerFooter}>
        <Text pt="lg" pb="lg" c="#485665">
          Copyright © 2021-{new Date().getFullYear()} <strong>Emochoice Canada Inc.</strong> All rights reserved.
        </Text>
      </Box>
    </>
  );
}
