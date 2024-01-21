import { Box, Menu, Tabs, Text } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { searchCategory } from "../../lib/database";
import { Tree, isNotEmptyObject } from "../../lib/utils";
import classes from "./index.module.css";

export default function DesktopDropdown({ tree }: { tree: Tree }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string | null>(null);

  useEffect(() => {
    const handlePathnameChange = () => {
      setActiveTab(
        ["/product", "/catalog"].some((path) => window.location.pathname.includes(path))
          ? "catalog"
          : window.location.pathname.includes("/gallery")
            ? "gallery"
            : window.location.pathname.includes("/contact")
              ? "contact"
              : null,
      );
    };
    handlePathnameChange();
    window.addEventListener("popstate", handlePathnameChange);
    return () => {
      window.removeEventListener("popstate", handlePathnameChange);
    };
  });

  return (
    <Menu trigger="hover" openDelay={250}>
      <Tabs
        value={activeTab}
        onChange={(tab) => setActiveTab(tab)}
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
                  <Menu.Item
                    onClick={async () => {
                      const ID = (await searchCategory(decodeURIComponent(key))).id;
                      navigate(`/catalog?filters=category:${ID}`);
                    }}
                  >
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
                              onClick={async () => {
                                const IDs = await Promise.all(
                                  [key, key2].map(async (name) => {
                                    return (await searchCategory(decodeURIComponent(name))).id;
                                  }),
                                );
                                navigate(`/catalog?filters=category:${IDs.join("+")}`);
                              }}
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
                              <Menu.Item
                                key={key3}
                                onClick={async () => {
                                  const IDs = await Promise.all(
                                    [key, key2, key3].map(async (name) => {
                                      return (await searchCategory(decodeURIComponent(name))).id;
                                    }),
                                  );
                                  navigate(`/catalog?filters=category:${IDs.join("+")}`);
                                }}
                              >
                                {key3}
                              </Menu.Item>
                            ))}
                          </Menu.Dropdown>
                        </Menu>
                      </Menu.Item>
                    ) : (
                      <Menu.Item
                        key={key2}
                        onClick={async () => {
                          const IDs = await Promise.all(
                            [key, key2].map(async (name) => {
                              return (await searchCategory(decodeURIComponent(name))).id;
                            }),
                          );
                          navigate(`/catalog?filters=category:${IDs.join("+")}`);
                        }}
                      >
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
