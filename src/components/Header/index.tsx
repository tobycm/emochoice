import { Burger, Container, Group, Image, Tabs } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import classes from "./index.module.css";

export default function Header() {
  const [opened, { toggle }] = useDisclosure(false);

  const [productTabHovering, setProductTabHovering] = useState(false);

  return (
    <div className={classes.header}>
      <Container className={classes.mainSection}>
        <Group justify="space-between">
          <Image src={"/full_logo.svg"} h={"9vh"} w={"auto"} />
          <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
        </Group>
      </Container>
      <Container>
        <Tabs
          defaultValue="Home"
          variant="outline"
          classNames={{
            root: classes.tabs,
            list: classes.tabsList,
            tab: classes.tab,
          }}
        >
          <Tabs.List>
            <Tabs.Tab
              value="products"
              key={"products"}
              onMouseEnter={() => {
                console.log("hover");
                setProductTabHovering(true);
              }}
              onMouseLeave={() => {
                if (!productTabHovering) return;
                console.log("leave");
                setProductTabHovering(false);
              }}
            >
              All Products
            </Tabs.Tab>
            <Tabs.Tab value="gallery" key={"gallery"}>
              Gallery
            </Tabs.Tab>
            <Tabs.Tab value="contact" key={"contact"}>
              Contact
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>
      </Container>
    </div>
  );
}
