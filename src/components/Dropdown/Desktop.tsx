import { Box, Flex, Loader, Menu, Tabs, Text } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ProductCategory } from "../../lib/database/models";
import { Tree } from "../../lib/utils";
import classes from "./index.module.css";

export default function DesktopDropdown({ tree, fetching }: { tree: Tree; fetching: boolean }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string | null>(null);

  /**
   * @param categories IDs of categories to go to
   */
  function goToCatalog(categories?: ProductCategory[]) {
    return () => {
      navigate(`/catalog${categories?.length ? `?filters=category:${categories.map((cate) => cate.id).join("+")}` : ""}`);
    };
  }

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
        visibleFrom="sm"
        classNames={{ root: classes.tabs, list: classes.tabsList, tab: classes.tab }}
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
            <Flex>
              {fetching ? (
                <Flex align="center" direction="column">
                  <Loader mt="md" />
                  <Text m="md" fz="lg">
                    Loading...
                  </Text>
                </Flex>
              ) : (
                Array.from(tree.entries()).map(([cate, subTree]) => (
                  <Box mr="xs" key={cate.id}>
                    <Menu.Item onClick={goToCatalog([cate])}>
                      <Text size="md" className={classes.menuTitle}>
                        {cate.name}
                      </Text>
                    </Menu.Item>
                    {Array.from(subTree.entries()).map(([cate2, subTree]) =>
                      !subTree.size ? (
                        <Menu.Item key={cate2.id} onClick={goToCatalog([cate, cate2])}>
                          {cate2.name}
                        </Menu.Item>
                      ) : (
                        <Menu.Item key={cate2.id}>
                          <Menu trigger="hover" position="right-start" arrowPosition="center" offset={20} openDelay={250}>
                            <Menu.Target>
                              <Flex onClick={goToCatalog([cate, cate2])} justify="space-between" align="center" w="100%">
                                <Text size="sm">{cate2.name}</Text>
                                <IconChevronRight width={20} />
                              </Flex>
                            </Menu.Target>
                            <Menu.Dropdown>
                              {Array.from(subTree.entries()).map(([cate3]) => (
                                <Menu.Item key={cate3.id} onClick={goToCatalog([cate, cate2, cate3])}>
                                  {cate3.name}
                                </Menu.Item>
                              ))}
                            </Menu.Dropdown>
                          </Menu>
                        </Menu.Item>
                      ),
                    )}
                  </Box>
                ))
              )}
            </Flex>
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
