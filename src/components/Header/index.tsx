import { ActionIcon, Box, Container, Group, Image, Menu, Tabs, Text, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import classes from "./index.module.css";

export default function Header() {
  return (
    <Box className={classes.header}>
      <Container className={classes.mainSection}>
        <Group justify="space-between">
          <Link to={"/"}>
            <Image src={"/full_logo.svg"} h={70} w={"auto"} style={{pointerEvents: "none"}} />
          </Link>
          {/* <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" /> */}
          <Box display={"flex"} style={{ alignItems: "center" }}>
            <TextInput radius="xl" w={250} mr={10} placeholder="What are you looking for?" />
            <ActionIcon variant="filled" radius="lg" size="lg">
              <IconSearch style={{ width: "60%", height: "60%" }} stroke={3} />
            </ActionIcon>
          </Box>
        </Group>
      </Container>
      <Container>
        <Menu trigger="hover" openDelay={400}>
          <Tabs
            variant="outline"
            classNames={{
              root: classes.tabs,
              list: classes.tabsList,
              tab: classes.tab,
            }}
          >
            <Tabs.List>
              <Menu.Target>
                <Link to="/product" style={{ textDecoration: "none", color: "black" }}>
                  <Tabs.Tab value="products" key={"products"}>
                    All Products
                  </Tabs.Tab>
                </Link>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Clothing & Accessories Print</Menu.Label>
                <Menu.Item rightSection={
            <Text size="xs" c="dimmed">
            {">"}
            </Text>
          }>
                  <Menu trigger="hover" position="right-start" withArrow arrowPosition="center" offset={20} openDelay={250}>
                    <Menu.Target>
                      <Text size="sm">T-Shirts</Text>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item>Mens & Unisex</Menu.Item>
                      <Menu.Item>Womens</Menu.Item>
                      <Menu.Item>Youths</Menu.Item>
                      <Menu.Item>Infants & Toddlers</Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Menu.Item>
                <Menu.Item>Sweatshirt & Fleece</Menu.Item>
                <Menu.Item>Activewear</Menu.Item>
                <Menu.Item>Hats</Menu.Item>
                <Menu.Item>Bags</Menu.Item>
                <Menu.Item>Others</Menu.Item>
                <Menu.Divider />
                <Menu.Label>Digital Printing</Menu.Label>
                <Menu.Item>Stickers</Menu.Item>
                <Menu.Item>Banners</Menu.Item>
                <Menu.Item>Brochures</Menu.Item>
                <Menu.Divider />
                <Menu.Label>Souvenirs & Gifts Printing</Menu.Label>
                <Menu.Item>Coffee Mugs</Menu.Item>
                <Menu.Item>Photo Slates</Menu.Item>
                <Menu.Item>Key Chain</Menu.Item>
                <Menu.Item>Water Bottle</Menu.Item>
              </Menu.Dropdown>
              <Link to="/gallery" style={{ textDecoration: "none", color: "black" }}>
                <Tabs.Tab value="gallery">Gallery</Tabs.Tab>
              </Link>
              <Link to="/contact" style={{ textDecoration: "none", color: "black" }}>
                <Tabs.Tab value="contact">Contact</Tabs.Tab>
              </Link>
            </Tabs.List>
          </Tabs>
        </Menu>
      </Container>
    </Box>
  );
}
