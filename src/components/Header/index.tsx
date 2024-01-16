import { ActionIcon, Autocomplete, Box, Burger, Container, Drawer, Group, Image, Indicator, Modal, NavLink, Space } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { IconPhone, IconPhoto, IconSearch, IconShoppingCart } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getDropdownMenuList, getProducts } from "../../lib/database";
import { useList } from "../../lib/list";
import { Tree, makeDropdownTree } from "../../lib/utils";
import DesktopDropdown from "../Dropdown/Desktop";
import MobileDropdown from "../Dropdown/Mobile";
import classes from "./index.module.css";

export default function Header() {
  const [drawerOpened, { toggle: toggleDrawer }] = useDisclosure(false);
  const [searchbarOpened, { toggle: toggleSearchbar }] = useDisclosure(false);
  const [showIndicator, setShowIndicator] = useState(false);
  const [productsNames, setProductsNames] = useState<string[]>([]);
  const { list } = useList();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 36em)");

  const [dropdownTree, setDropdownTree] = useState<Tree>({});

  useEffect(() => {
    getDropdownMenuList().then((items) => {
      const existingItems: string[] = [];

      for (const item of items)
        setDropdownTree((prev) => {
          if (existingItems.includes(item.expand?.parent?.name ?? "")) return prev;

          const [tree, eItems] = makeDropdownTree(item, items);

          existingItems.push(...eItems);

          return {
            ...prev,
            [item.expand?.parent?.name ?? ""]: tree,
          };
        });
    });
  }, []);

  function search(wide: boolean) {
    const searchQuery = document.getElementById(wide ? "searchbarWide" : "searchbarMobile")?.getAttribute("value");
    if (!searchQuery) return;
    navigate("/catalog", { state: { searchQuery } });
    if (isMobile) toggleSearchbar();
  }

  const searchResults: string[] = [];

  useEffect(() => {
    getProducts().then((products) => {
      products.forEach((product) => {
        if (!searchResults.includes(`${product.name}${product.custom_id && ` - ${product.custom_id}`}`)) {
          setProductsNames((prev) => [...prev, `${product.name}${product.custom_id && ` - ${product.custom_id}`}`]);
          searchResults.push(`${product.name}${product.custom_id && ` - ${product.custom_id}`}`);
        }
      });
    });
  }, []);

  useEffect(() => {
    setShowIndicator(list.length > 0);
  }, [list]);

  return (
    <Box className={classes.header}>
      <Container className={classes.mainSection}>
        <Modal opened={searchbarOpened} onClose={toggleSearchbar} title={"Search"} size="md">
          {/** Search modal on mobile */}
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
          {/** Categories "dropdown" on mobile */}
          <NavLink
            leftSection={<IconSearch size="1rem" stroke={1.5} />}
            label="Search"
            onClick={() => {
              toggleDrawer();
              toggleSearchbar();
            }}
            hiddenFrom="mn"
          />
          <MobileDropdown closeDrawer={toggleDrawer} tree={dropdownTree} />
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
        <DesktopDropdown tree={dropdownTree} />
      </Container>
    </Box>
  );
}
