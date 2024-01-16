import { Box, Menu, Tabs, Text } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";
import { Tree, isNotEmptyObject } from "../../lib/utils";
import classes from "./index.module.css";

export default function DesktopDropdown({ tree }: { tree: Tree }) {
  const navigate = useNavigate();

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
              {Object.keys(tree).map((key) => (
                <Box mr="xs">
                  <Menu.Item onClick={() => navigate("/catalog", { state: { categories: [key] } })}>
                    <Text size="md" className={classes.menuTitle}>
                      {key}
                    </Text>
                  </Menu.Item>
                  {Object.keys(tree[key]).map((key2) => {
                    const subTree = (tree[key] as Record<string, string>)[key2];
                    return isNotEmptyObject(subTree) ? (
                      <Menu.Item key={key2}>
                        <Menu trigger="hover" position="right-start" arrowPosition="center" offset={20} openDelay={250}>
                          <Menu.Target>
                            <Box
                              onClick={() => navigate("/catalog", { state: { categories: ["T-Shirts"] } })}
                              display="flex"
                              style={{ justifyContent: "space-between", alignItems: "center" }}
                              w="100%"
                            >
                              <Text size="sm">{key2}</Text>
                              <IconChevronRight style={{ width: "20px" }} />
                            </Box>
                          </Menu.Target>
                          <Menu.Dropdown>
                            {Object.keys(subTree).map((key3) => (
                              <Menu.Item key={key3} onClick={() => navigate("/catalog", { state: { categories: [key3] } })}>
                                {key3}
                              </Menu.Item>
                            ))}
                          </Menu.Dropdown>
                        </Menu>
                      </Menu.Item>
                    ) : (
                      <Menu.Item key={key2} onClick={() => navigate("/catalog", { state: { categories: [key2] } })}>
                        {key2}
                      </Menu.Item>
                    );
                  })}
                </Box>
              ))}
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
