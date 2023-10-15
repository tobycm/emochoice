import {
  Box,
  Burger,
  Container,
  Group,
  Image,
  Menu,
  Tabs,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link } from "react-router-dom";
import classes from "./index.module.css";

export default function Header() {
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <Box className={classes.header}>
      <Container className={classes.mainSection}>
        <Group justify="space-between">
          <Image src={"/full_logo.svg"} h={"9vh"} w={"auto"} />
          <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
        </Group>
      </Container>
      <Container>
        <Menu trigger="hover">
          <Tabs
            variant="outline"
            classNames={{
              root: classes.tabs,
              list: classes.tabsList,
              tab: classes.tab,
            }}
          >
            <Tabs.List>
              <Menu.Target>
                <Tabs.Tab value="products" key={"products"}>
                  All Products
                </Tabs.Tab>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>Application</Menu.Label>
                <Menu.Item>Settings</Menu.Item>
              </Menu.Dropdown>

              <Tabs.Tab value="gallery">
                <Link
                  to="/gallery"
                  style={{ textDecoration: "none", color: "black" }}
                >
                  Gallery
                </Link>
              </Tabs.Tab>
              <Tabs.Tab value="contact">Contact</Tabs.Tab>
            </Tabs.List>
          </Tabs>
        </Menu>
      </Container>
    </Box>
  );
}
