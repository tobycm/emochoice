import { Burger, Container, Group, Image, Menu, Tabs } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./index.module.css";

export default function Header() {
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <div className={classes.header}>
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

              <Tabs.Tab value="gallery" onClick={() => {}}>
                Gallery
              </Tabs.Tab>
              <Tabs.Tab value="contact" onClick={() => {}}>
                Contact
              </Tabs.Tab>
            </Tabs.List>
          </Tabs>
        </Menu>
      </Container>
    </div>
  );
}
