import { Box, Burger, Container, Drawer, Flex, Image, NavLink } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { IconPhone, IconPhoto } from "@tabler/icons-react";
import { useEffect, useState } from "preact/hooks";
import { Link } from "react-router-dom";
import { getDropdownMenuList, getProducts } from "../../lib/database";
import { Tree, makeDropdownTree } from "../../lib/utils";
import { ProductWithKeywords } from "../../lib/utils/search";
import DesktopDropdown from "../Dropdown/Desktop";
import MobileDropdown from "../Dropdown/Mobile";
import ListButton from "../ListButton";
import SearchBar from "../SearchBar";
import classes from "./index.module.css";

export default function Header() {
  const [drawerOpened, { toggle: toggleDrawer }] = useDisclosure(false);

  const [products, setProducts] = useState<ProductWithKeywords[]>([]);

  useEffect(() => {
    getProducts().then((products) =>
      setProducts(
        products.map(
          (product) => (
            (product.keywords =
              `${product.name} ${(product.expand.colors ?? []).map((color) => color.name).join(" ")} ${product.custom_id} ${(product.expand.types ?? []).map((type) => type.name).join(" ")} ${(product.expand.category ?? []).map((category) => category.name).join(" ")} ${product.expand.brand.name}`.toLowerCase()),
            product
          ),
        ) as ProductWithKeywords[],
      ),
    );
  }, []);

  const [dropdownTree, setDropdownTree] = useState(new Tree());

  useEffect(() => {
    getDropdownMenuList().then((items) => {
      const existingItems: string[] = [];

      for (const item of items)
        setDropdownTree((prev) => {
          if (existingItems.includes(item.expand?.parent?.name ?? "")) return prev;

          const [tree, eItems] = makeDropdownTree(item, items);

          existingItems.push(...eItems);

          return prev.set(item.expand!.parent!, tree);
        });
    });
  }, []);

  const isMobile = useMediaQuery("(max-width: 48em)");

  return (
    <Box className={classes.header}>
      <Container className={classes.mainSection}>
        <Drawer opened={drawerOpened} onClose={toggleDrawer} title={"Menu"} size="xs">
          {/* Categories "dropdown" on mobile */}
          <MobileDropdown closeDrawer={toggleDrawer} tree={dropdownTree} />
          <Link to="/gallery" style={{ textDecoration: "none", color: "black" }} onClick={toggleDrawer}>
            <NavLink label="Gallery" leftSection={<IconPhoto size="1rem" stroke={1.5} />} />
          </Link>
          <Link to="/contact" style={{ textDecoration: "none", color: "black" }} onClick={toggleDrawer}>
            <NavLink label="Contact" leftSection={<IconPhone size="1rem" stroke={1.5} />} />
          </Link>
        </Drawer>
        <Flex align="center" direction={isMobile ? "column" : "row"} justify="space-between">
          <Flex w={"100%"} align="center">
            <Burger opened={drawerOpened} onClick={toggleDrawer} size="sm" maw={"28px"} mr="sm" hiddenFrom="sm" />
            <Link to={"/"} style={{ display: "flex", justifyContent: "center", marginLeft: "6px" }}>
              <Image src={"/images/full_logo.svg"} mih={60} mah={70} h="7vh" w={"auto"} style={{ pointerEvents: "none" }} />
            </Link>
          </Flex>
          <Flex w={"100%"} justify={"flex-right"} align={"center"} mt={isMobile ? "sm" : "0"}>
            <SearchBar products={products} />
            <ListButton />
          </Flex>
        </Flex>
      </Container>
      <Container>
        <DesktopDropdown tree={dropdownTree} />
      </Container>
    </Box>
  );
}
