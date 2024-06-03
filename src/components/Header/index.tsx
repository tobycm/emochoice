import { Box, Burger, Container, Drawer, Flex, Image, NavLink } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { IconPhone, IconPhoto } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { getDropdownMenuList } from "../../lib/database";
import { Tree, makeDropdownTree } from "../../lib/utils";
import DesktopDropdown from "../Dropdown/Desktop";
import MobileDropdown from "../Dropdown/Mobile";
import ListButton from "../ListButton";
import SearchBar from "../SearchBar";
import classes from "./index.module.css";

export default function Header() {
  const isMobile = useMediaQuery("(max-width: 48em)");

  const [drawerOpened, { toggle: toggleDrawer }] = useDisclosure(false);

  const dropdownMenu = useQuery({ queryKey: ["dropdown_menu"], queryFn: getDropdownMenuList });

  const dropdownTree: Tree = useMemo(() => {
    const dropdownTree = new Tree();

    if (!dropdownMenu.data) return dropdownTree;

    const existingItems: string[] = [];
    for (const item of dropdownMenu.data) {
      if (existingItems.includes(item.expand?.parent?.name ?? "")) continue;

      const [tree, eItems] = makeDropdownTree(item, dropdownMenu.data);

      existingItems.push(...eItems);

      dropdownTree.set(item.expand!.parent!, tree);
    }

    return dropdownTree;
  }, [dropdownMenu.data]);

  return (
    <Box className={classes.header}>
      <Container className={classes.mainSection}>
        <Drawer opened={drawerOpened} onClose={toggleDrawer} title={"Menu"} size="xs">
          {/* Categories "dropdown" on mobile */}
          <MobileDropdown closeDrawer={toggleDrawer} tree={dropdownTree} fetching={dropdownMenu.isFetching} />
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
            <SearchBar />
            <ListButton />
          </Flex>
        </Flex>
      </Container>
      <Container>
        <DesktopDropdown tree={dropdownTree} fetching={dropdownMenu.isFetching} />
      </Container>
    </Box>
  );
}
