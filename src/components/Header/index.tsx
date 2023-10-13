import { Burger, Container, Group, Image, Tabs } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./index.module.css";

const tabs = [
  "Home",
  "Orders",
  "Education",
  "Community",
  "Forums",
  "Support",
  "Account",
  "Helpdesk",
];

export default function Header() {
  const [opened, { toggle }] = useDisclosure(false);

  const items = tabs.map((tab) => (
    <Tabs.Tab value={tab} key={tab}>
      {tab}
    </Tabs.Tab>
  ));

  return (
    <div className={classes.header}>
      <Container className={classes.mainSection} size="md">
        <Group justify="space-between">
          <Image src={"/full_logo.svg"} h={"10vh"} w={"auto"} />
          <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
        </Group>
      </Container>
      <Container size="md">
        <Tabs
          defaultValue="Home"
          variant="outline"
          visibleFrom="sm"
          classNames={{
            root: classes.tabs,
            list: classes.tabsList,
            tab: classes.tab,
          }}
        >
          <Tabs.List>{items}</Tabs.List>
        </Tabs>
      </Container>
    </div>
  );
}
