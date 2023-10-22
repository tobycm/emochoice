import { ActionIcon, Box, Burger, Container, Group, Image, Indicator, Menu, Tabs, Text, TextInput } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { IconSearch, IconShoppingCart } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import classes from "./index.module.css";

export default function Header() {
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <Box className={classes.header}>
      <Container className={classes.mainSection}>
        <Group justify="space-between" display="flex">
          <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" style={{ flex: useMediaQuery(`(max-width: 36em)`) ? "1" : "none" }} />
          <Link to={"/"} style={{ flex: useMediaQuery(`(max-width: 36em)`) ? "1" : "none" }}>
            <Image src={"/images/full_logo.svg"} mih={50} mah={70} h="7vh" w={"auto"} style={{ pointerEvents: "none" }} />
          </Link>
          <Box display={"flex"} style={{ flex: useMediaQuery(`(max-width: 36em)`) ? "1" : "none" }}>
            <TextInput radius="xl" w={220} mr={10} placeholder="What are you looking for?" visibleFrom={"xs"} />
            <ActionIcon variant="filled" radius="lg" size="lg" mr={10} ml={useMediaQuery(`(max-width: 36em)`) ? "auto" : "none"}>
              <IconSearch style={{ width: "60%", height: "60%" }} stroke={3} />
            </ActionIcon>
            <Link to="/list">
              <Indicator inline label="3" color="red" size={16}>
                <ActionIcon variant="red" radius="lg" size="lg">
                  <IconShoppingCart style={{ width: "60%", height: "60%" }} stroke={3} />
                </ActionIcon>
              </Indicator>
            </Link>
          </Box>
        </Group>
      </Container>
      <Container>
        <Menu trigger="hover" openDelay={505}>
          <Tabs
            variant="outline"
            visibleFrom="xs"
            classNames={{
              root: classes.tabs,
              list: classes.tabsList,
              tab: classes.tab,
            }}
          >
            <Tabs.List>
              <Menu.Target>
                <Link to="/catalog" style={{ textDecoration: "none", color: "black" }}>
                  <Tabs.Tab value="catalog" key={"catalog"}>
                    All Products
                  </Tabs.Tab>
                </Link>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Clothing & Accessories Print</Menu.Label>
                <Menu.Item
                  rightSection={
                    <Text size="xs" c="dimmed">
                      {">"}
                    </Text>
                  }
                >
                  <Menu trigger="hover" position="right-start" withArrow arrowPosition="center" offset={20} openDelay={250}>
                    <Menu.Target>
                      <Text size="sm">T-Shirts</Text>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item>Mens & Unisex</Menu.Item>
                      <Menu.Item>Womens</Menu.Item>
                      <Menu.Item>Youth</Menu.Item>
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
