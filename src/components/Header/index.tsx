import { ActionIcon, Box, Container, Group, Image, Menu, Tabs, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import classes from "./index.module.css";

export default function Header() {
  return (
    <Box className={classes.header}>
      <Container className={classes.mainSection}>
        <Group justify="space-between">
          <Link to={"/"}>
            <Image src={"/full_logo.svg"} h={"9vh"} w={"auto"} mih={30} mah={70} />
          </Link>
          {/* <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" /> */}
          <Box display={"flex"} style={{ alignItems: "center" }}>
            <TextInput radius="xl" w={250} mr={10} placeholder="What are you looking for?" />
            <ActionIcon variant="filled" radius="lg" size="lg">
              <IconSearch style={{ width: "60%", height: "60%" }} stroke={3} />
            </ActionIcon>
          </Box>
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
