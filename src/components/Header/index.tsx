import {
  ActionIcon,
  Autocomplete,
  Box,
  Burger,
  Container,
  Drawer,
  Group,
  Image,
  Indicator,
  Menu,
  Modal,
  NavLink,
  Space,
  Tabs,
  Text,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { IconChevronRight, IconPhone, IconPhoto, IconSearch, IconShirt, IconShoppingCart } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProducts } from "../../lib/database";
import { useList } from "../../lib/list";
import classes from "./index.module.css";

export default function Header() {
  const [drawerOpened, { toggle: toggleDrawer }] = useDisclosure(false);
  const [searchbarOpened, { toggle: toggleSearchbar }] = useDisclosure(false);
  const [showIndicator, setShowIndicator] = useState(false);
  const [productsNames, setProductsNames] = useState<string[]>([]);
  const { list } = useList();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 36em)");

  function search(wide: boolean) {
    const searchQuery = document.getElementById(wide ? "searchbarWide" : "searchbarMobile")?.getAttribute("value");
    if (!searchQuery) return;
    navigate("/catalog", { state: { searchQuery: searchQuery } });
    isMobile && toggleSearchbar();
  }

  const tempSearchList = new Array<string>();
  function getProductsNames() {
    getProducts().then((products) => {
      products.forEach((product) => {
        if (!tempSearchList.includes(`${product.name}${product.custom_id && ` - ${product.custom_id}`}`)) {
          setProductsNames((prev) => [...prev, `${product.name}${product.custom_id && ` - ${product.custom_id}`}`]);
          tempSearchList.push(`${product.name}${product.custom_id && ` - ${product.custom_id}`}`);
        }
      });
    });
  }

  useEffect(() => {
    getProductsNames();
  }, []);

  useEffect(() => {
    setShowIndicator(list.length > 0);
  }, [list]);

  return (
    <Box className={classes.header}>
      <Container className={classes.mainSection}>
        <Modal opened={searchbarOpened} onClose={toggleSearchbar} title={"Search"} size="md">
          <Box display={"flex"} style={{ justifyContent: "space-between" }}>
            <Autocomplete
              radius="xl"
              w={"80%"}
              mr={10}
              placeholder="What are you looking for?"
              id={"searchbarMobile"}
              data={productsNames}
              onKeyDown={(e) => {
                if (e.key === "Enter") search(false);
              }}
              limit={10}
            />

            <ActionIcon
              variant="filled"
              radius="lg"
              size="lg"
              mr={10}
              ml={isMobile ? "auto" : "none"}
              onClick={() => {
                search(false);
              }}
            >
              <IconSearch style={{ width: "60%", height: "60%" }} stroke={3} />
            </ActionIcon>
          </Box>
        </Modal>
        <Drawer opened={drawerOpened} onClose={toggleDrawer} title={"Menu"} size="xs">
          <NavLink
            leftSection={<IconSearch size="1rem" stroke={1.5} />}
            label="Search"
            onClick={() => {
              toggleDrawer();
              toggleSearchbar();
            }}
            hiddenFrom="mn"
          />
          <NavLink label="All Products" leftSection={<IconShirt size="1rem" stroke={1.5} />} defaultOpened childrenOffset={28}>
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
        <Group justify="space-between" display="flex" style={{ alignItems: "center" }}>
          <Box display={"flex"} hiddenFrom="xs">
            <Burger opened={drawerOpened} onClick={toggleDrawer} size="sm" maw={isMobile ? "28px" : "auto"} />
            <Space w="44px" visibleFrom="mn" />
          </Box>
          <Link to={"/"} style={{ display: "flex", justifyContent: "center", marginLeft: "6px" }}>
            <Image src={"/images/full_logo.svg"} mih={60} mah={70} h="7vh" w={"auto"} style={{ pointerEvents: "none" }} />
          </Link>
          <Box display={"flex"} style={{ justifyContent: "flex-end", maxWidth: isMobile ? "78px" : "min-content" }}>
            <Autocomplete
              radius="xl"
              w={220}
              mr={10}
              placeholder="What are you looking for?"
              id={"searchbarWide"}
              visibleFrom={"xs"}
              data={productsNames}
              onKeyDown={(e) => {
                if (e.key === "Enter") search(true);
              }}
              limit={10}
            />
            <ActionIcon
              variant="filled"
              radius="lg"
              size="lg"
              mr={10}
              ml={isMobile ? "auto" : "none"}
              onClick={isMobile ? toggleSearchbar : () => search(true)}
              visibleFrom="mn"
            >
              <IconSearch style={{ width: "60%", height: "60%" }} stroke={3} />
            </ActionIcon>
            <Link to="/list">
              {showIndicator ? (
                <Indicator inline label={list.length} color="red" size={16}>
                  <ActionIcon variant="red" radius="lg" size="lg">
                    <IconShoppingCart style={{ width: "60%", height: "60%" }} stroke={3} />
                  </ActionIcon>
                </Indicator>
              ) : (
                <ActionIcon variant="red" radius="lg" size="lg">
                  <IconShoppingCart style={{ width: "60%", height: "60%" }} stroke={3} />
                </ActionIcon>
              )}
            </Link>
          </Box>
        </Group>
      </Container>
      <Container>
        <Menu trigger="hover" openDelay={250}>
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
                <Box display={"flex"}>
                  <Box mr="md">
                    <Menu.Item onClick={() => navigate("/catalog", { state: { categories: ["Clothing & Accessories Print"] } })}>
                      <Text size="md" className={classes.menuTitle}>
                        Clothing & Accessories Print
                      </Text>
                    </Menu.Item>
                    <Menu.Item>
                      <Menu trigger="hover" position="right-start" arrowPosition="center" offset={20} openDelay={250}>
                        <Menu.Target>
                          <Box
                            onClick={() => navigate("/catalog", { state: { categories: ["T-Shirts"] } })}
                            display="flex"
                            style={{ justifyContent: "space-between", alignItems: "center" }}
                            w="100%"
                          >
                            <Text size="sm">T-Shirts</Text>
                            <IconChevronRight style={{ width: "20px" }} />
                          </Box>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item onClick={() => navigate("/catalog", { state: { categories: ["Mens & Unisex"] } })}>Mens & Unisex</Menu.Item>
                          <Menu.Item onClick={() => navigate("/catalog", { state: { categories: ["Womens"] } })}>Womens</Menu.Item>
                          <Menu.Item onClick={() => navigate("/catalog", { state: { categories: ["Youth"] } })}>Youth</Menu.Item>
                          <Menu.Item onClick={() => navigate("/catalog", { state: { categories: ["Infants & Toddlers"] } })}>
                            Infants & Toddlers
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Menu.Item>
                    <Menu.Item onClick={() => navigate("/catalog", { state: { categories: ["Sweatshirts"] } })}>Sweatshirt & Fleece</Menu.Item>
                    <Menu.Item onClick={() => navigate("/catalog", { state: { categories: ["Activewear"] } })}>Activewear</Menu.Item>
                    <Menu.Item onClick={() => navigate("/catalog", { state: { categories: ["Hats"] } })}>Hats</Menu.Item>
                    <Menu.Item onClick={() => navigate("/catalog", { state: { categories: ["Bags"] } })}>Bags</Menu.Item>
                    <Menu.Item onClick={() => navigate("/catalog", { state: { categories: ["Others"] } })}>Others</Menu.Item>
                  </Box>
                  <Box mr="md">
                    <Menu.Item onClick={() => navigate("/catalog", { state: { categories: ["Digital Printing"] } })}>
                      <Text size="md" className={classes.menuTitle}>
                        Digital Printing
                      </Text>
                    </Menu.Item>
                    <Menu.Item onClick={() => navigate("/catalog", { state: { categories: ["Stickers"] } })}>Stickers</Menu.Item>
                    <Menu.Item onClick={() => navigate("/catalog", { state: { categories: ["Banners"] } })}>Banners</Menu.Item>
                    <Menu.Item onClick={() => navigate("/catalog", { state: { categories: ["Brochures"] } })}>Brochures</Menu.Item>
                  </Box>
                  <Box mr="md">
                    <Menu.Item onClick={() => navigate("/catalog", { state: { categories: ["Souvenirs & Gifts Printing"] } })}>
                      <Text size="md" className={classes.menuTitle}>
                        Souvenirs & Gifts Printing
                      </Text>
                    </Menu.Item>
                    <Menu.Item onClick={() => navigate("/catalog", { state: { categories: ["Mugs"] } })}>Coffee Mugs</Menu.Item>
                    <Menu.Item onClick={() => navigate("/catalog", { state: { categories: ["Photo Slates"] } })}>Photo Slates</Menu.Item>
                    <Menu.Item onClick={() => navigate("/catalog", { state: { categories: ["Keychains"] } })}>Key Chain</Menu.Item>
                    <Menu.Item onClick={() => navigate("/catalog", { state: { categories: ["Bottles"] } })}>Water Bottle</Menu.Item>
                  </Box>
                </Box>
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
