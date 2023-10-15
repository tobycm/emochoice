import {
  Box,
  Button,
  Container,
  Divider,
  FileInput,
  Image,
  List,
  NumberInput,
  SegmentedControl,
  Space,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { useState } from "react";
import classes from "./product.module.css";

export function Product() {
  const [size, setSize] = useState("react");
  const data = [
    { label: "11oz", value: "11oz" },
    { label: "15oz", value: "15oz" },
  ];

  return (
    <>
      <Container className={classes.overview}>
        <Image
          fit="cover"
          className={classes.image}
          src={
            "https://static.contrado.com/resources/images/2021-2/171266/design-your-own-mug-1116513_l.jpg"
          }
        ></Image>
        <Box style={{ margin: 20 }}>
          <Title>The Most Beautiful Mug in Canada!</Title>
          <Box className={classes.input}>
            <Text>Brand: Eggu in Canada</Text>
          </Box>
          <Box className={classes.input}>
            <Text>Size</Text>
            <Space w="md" />
            <SegmentedControl
              value={size}
              onChange={setSize}
              data={data}
              defaultValue="11oz"
            />
          </Box>
          <Box className={classes.input}>
            <Text>Quantity</Text>
            <Space w="md" />
            <NumberInput
              placeholder="Between 1 and 99"
              clampBehavior="strict"
              min={1}
              max={99}
            />
          </Box>
          <Box className={classes.input}>
            <Text>Upload image</Text>
            <Space w="md" />
            <FileInput
              accept="image/png,image/jpeg"
              variant="filled"
              placeholder="Your image"
            />
          </Box>
          <Box className={classes.input}>
            <Text>Request</Text>
            <Space w="md" />
            <Textarea
              autosize
              className={classes.textarea}
              minRows={2}
              maxRows={4}
              placeholder="Feel free to ask!"
            />
          </Box>
          <Box className={classes.input}>
            <Text>Phone number or Email</Text>
            <Space w="md" />
            <TextInput />
          </Box>
          <Button variant="filled" className={classes.input}>
            Buy
          </Button>
        </Box>
      </Container>
      <Container className={classes.information}>
        <Title order={2}>Description</Title>
        <Divider my="xs" />
        <Text>
          Introducing the ultimate companion for your morning ritual - The Most
          Beautiful Mug in Canada! Elevate your coffee or tea experience with
          this exquisite, handcrafted vessel designed to cradle your favorite
          brew. Crafted from high-quality, lead-free ceramic, it ensures your
          beverage's purity and taste remain untarnished. The ergonomic handle
          provides a comfortable grip, while the wide base offers stability. Its
          double-walled insulation keeps drinks at the perfect temperature,
          whether piping hot or refreshingly cool. The elegant, minimalist
          design complements any kitchen or office space. Dishwasher and
          microwave safe, it's a breeze to clean and maintain. Indulge in your
          daily dose of comfort and style with this exceptional mug!
        </Text>
      </Container>
      <Container className={classes.information}>
        <Title order={2}>Specification</Title>
        <Divider my="xs" />
        <List>
          <List.Item>Not a waifu</List.Item>
          <List.Item>Not a husbando</List.Item>
          <List.Item>A mug</List.Item>
        </List>
      </Container>
    </>
  );
}
