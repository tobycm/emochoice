import { Box, Menu, Tabs, Text } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";
import { Tree } from "../../lib/utils";
import classes from "./index.module.css";

export default function DesktopDropdown({ tree }: { tree: Tree }) {
  const navigate = useNavigate();

  console.log(tree);

  return (
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
  );
}
