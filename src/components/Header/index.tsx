import { ActionIcon, Box, Burger, Container, Drawer, Group, Image, Indicator, Menu, Modal, NavLink, Tabs, Text, TextInput } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { IconPhone, IconPhoto, IconSearch, IconShirt, IconShoppingCart } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import classes from "./index.module.css";

export default function Header() {
  const [drawerOpened, { toggle: toggleDrawer }] = useDisclosure(false);
  const [searchbarOpened, { toggle: toggleSearchbar }] = useDisclosure(false);

  return (
    <Box className={classes.header}>
      <Container className={classes.mainSection}>
        <Modal opened={searchbarOpened} onClose={toggleSearchbar} title={"Search"} size="md">
          <Box display={"flex"} style={{ justifyContent: "space-between" }}>
            <TextInput radius="xl" w={"80%"} mr={10} placeholder="What are you looking for?" id={"searchbarMobile"} />
            <ActionIcon
              variant="filled"
              radius="lg"
              size="lg"
              mr={10}
              ml={useMediaQuery(`(max-width: 36em)`) ? "auto" : "none"}
              onClick={toggleSearchbar}
            >
              <IconSearch style={{ width: "60%", height: "60%" }} stroke={3} />
            </ActionIcon>
          </Box>
        </Modal>
        <Drawer opened={drawerOpened} onClose={toggleDrawer} title={"Menu"} size="xs">
          <NavLink label="All Products" leftSection={<IconShirt size="1rem" stroke={1.5} />} opened childrenOffset={28}>
            <Link to="/catalog" style={{ textDecoration: "none", color: "black" }} onClick={toggleDrawer}>
              <NavLink label="Catalog"></NavLink>
            </Link>
            <NavLink label="Clothing & Accessories Print" childrenOffset={28}>
              <NavLink label="T-Shirts" childrenOffset={28}>
                <NavLink label="Mens & Unisex" />
                <NavLink label="Womens" />
                <NavLink label="Youth" />
                <NavLink label="Infants & Toddlers" />
              </NavLink>
              <NavLink label="Sweatshirt & Fleece" />
              <NavLink label="Activewear" />
              <NavLink label="Hats" />
              <NavLink label="Bags" />
              <NavLink label="Others" />
            </NavLink>
            <NavLink label="Digital Printing" childrenOffset={28}>
              <NavLink label="Stickers" />
              <NavLink label="Banners" />
              <NavLink label="Brochures" />
            </NavLink>
            <NavLink label="Souvenirs & Gifts Printing" childrenOffset={28}>
              <NavLink label="Coffee Mugs" />
              <NavLink label="Photo Slates" />
              <NavLink label="Key Chain" />
              <NavLink label="Water Bottle" />
            </NavLink>
          </NavLink>
          <Link to="/gallery" style={{ textDecoration: "none", color: "black" }} onClick={toggleDrawer}>
            <NavLink label="Gallery" leftSection={<IconPhoto size="1rem" stroke={1.5} />} />
          </Link>
          <Link to="/contact" style={{ textDecoration: "none", color: "black" }} onClick={toggleDrawer}>
            <NavLink label="Contact" leftSection={<IconPhone size="1rem" stroke={1.5} />} />
          </Link>
        </Drawer>
        <Group justify="space-between" display="flex">
          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            hiddenFrom="xs"
            size="sm"
            style={{ flex: useMediaQuery(`(max-width: 36em)`) ? "1" : "none" }}
          />
          <Link to={"/"} style={{ flex: useMediaQuery(`(max-width: 36em)`) ? "1" : "none" }}>
            <Image src={"/images/full_logo.svg"} mih={50} mah={70} h="7vh" w={"auto"} style={{ pointerEvents: "none" }} />
          </Link>
          <Box display={"flex"} style={{ flex: useMediaQuery(`(max-width: 36em)`) ? "1" : "none" }}>
            <TextInput radius="xl" w={220} mr={10} placeholder="What are you looking for?" id={"searchbarWide"} visibleFrom={"xs"} />
            <ActionIcon
              variant="filled"
              radius="lg"
              size="lg"
              mr={10}
              ml={useMediaQuery(`(max-width: 36em)`) ? "auto" : "none"}
              onClick={useMediaQuery(`(max-width: 36em)`) ? toggleSearchbar : () => {}}
            >
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
