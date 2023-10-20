import { Container, Title, Box, Badge, Button, Card, Group, Image, Text, Divider } from "@mantine/core";
import classes from "./index.module.css"

export default function Home() {
  return <Container style={{display: "flex", alignItems: "center", flexDirection: "column"}}>

    <Image src="images/full_logo.svg" w={"40%"}/>
    <Text mt={"lg"}>Created from two words: "emotion" and "choice"</Text>
    {/* design thêm tí nữa cho bắt mắt, nên bỏ ra khỏi container */}

    <Divider my="xl" size="xs" w={"100%"}></Divider>

    <Title order={2} mb="xl">
      Shop by category
    </Title>
    <Box className={classes.cardsBox}>
      <Card shadow="sm" padding="lg" radius="md" withBorder className={classes.card}>
        <Card.Section m={"2%"} h={"20%"}>
          <Title order={3} style={{textAlign: "center"}}>Clothing & Accessories Print</Title>
        </Card.Section>
        <Card.Section h={"80%"}>
          <Image
            src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
            height={160}
            alt="Norway"
            maw={"100%"} 
            h={"100%"}
          />
        </Card.Section>
      </Card>
      <Card shadow="sm" padding="lg" radius="md" withBorder className={classes.card}>
      <Card.Section m={"2%"} h={"20%"}>
          <Title order={3} style={{textAlign: "center"}}>Digital Printing</Title>
        </Card.Section>
        <Card.Section h={"80%"}>
          <Image
            src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
            height={160}
            alt="Norway"
            maw={"100%"} 
            h={"100%"}
          />
        </Card.Section>
      </Card>
      <Card shadow="sm" padding="lg" radius="md" withBorder className={classes.card}>
      <Card.Section m={"2%"} h={"20%"}>
          <Title order={3} style={{textAlign: "center"}}>Souvenirs & Gifts Printing</Title>
        </Card.Section>
        <Card.Section h={"80%"}>
          <Image
            src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
            height={160}
            alt="Norway"
            maw={"100%"} 
            h={"100%"}
          />
        </Card.Section>
      </Card>
    </Box>

    <Divider my="xl" size="xs" w={"100%"}></Divider> 

    <Title order={2} mb="xl">
      Gallery
    </Title>
    <Box></Box>
  </Container>;
}
