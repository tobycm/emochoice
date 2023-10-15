import {
  Box,
  Button,
  Container,
  Divider,
  FileInput,
  Image,
  NumberInput,
  SegmentedControl,
  Space,
  Table,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import classes from "./index.module.css";

export default function Product() {
  const data = {
    id: "messikimochi",
    name: "The Most Beautiful Mug in Canada!",
    price: 7.27,
    category: "Mug",
    description:
      "Introducing the ultimate companion for your morning ritual - The Most Beautiful Mug in Canada! Elevate your coffee or tea experience with this exquisite, handcrafted vessel designed to cradle your favorite brew. Crafted from high-quality, lead-free ceramic, it ensures your beverage's purity and taste remain untarnished. The ergonomic handle provides a comfortable grip, while the wide base offers stability. Its double-walled insulation keeps drinks at the perfect temperature, whether piping hot or refreshingly cool. The elegant, minimalist design complements any kitchen or office space. Dishwasher and microwave safe, it's a breeze to clean and maintain. Indulge in your daily dose of comfort and style with this exceptional mug!",
    custom_data: {
      size: ["11oz", "15oz"],
      "Material Type": "Ceramic",
    },
  };

  const form = useForm({
    initialValues: {
      quantity: "1",
      size: "11oz",
    },
  });

  return (
    <>
      <Container className={classes.overview}>
        <Image
          className={classes.image}
          src={"https://m.media-amazon.com/images/I/71wjKdsRbLL.jpg"}
        ></Image>
        <Box ml={30} mt={10}>
          <Title>The Most Beautiful Mug in Canada!</Title>
          <Space h="md" />
          <Title style={{ color: "#228be6" }}>${data.price}</Title>
          <form onSubmit={form.onSubmit((values) => console.log(values))}>
            <Box className={classes.input}>
              <Text>Size</Text>
              <Space w="md" />
              <SegmentedControl
                data={data.custom_data.size.map((size) => ({
                  label: size,
                  value: size,
                }))}
                {...form.getInputProps("size")}
              />
            </Box>
            <Box className={classes.input}>
              <Text>Quantity</Text>
              <Space w="md" />
              <NumberInput
                style={{ width: "180px" }}
                placeholder="Between 1 and 99"
                clampBehavior="strict"
                min={1}
                max={99}
                {...form.getInputProps("quantity")}
              />
            </Box>
            <Box className={classes.input}>
              <Text>Your image</Text>
              <Space w="md" />
              <FileInput
                accept="image/png,image/jpeg"
                variant="filled"
                placeholder="Upload"
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
              <TextInput placeholder="your@email.com" />
            </Box>
            <Button variant="filled" className={classes.input} type="submit">
              Buy
            </Button>
          </form>
        </Box>
      </Container>
      <Container className={classes.information}>
        <Title order={2}>Description</Title>
        <Divider my="xs" />
        <Text>{data.description}</Text>
      </Container>
      <Container className={classes.information}>
        <Title order={2}>Technical Details</Title>
        <Divider my="xs" />
        <Table>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td>
                <strong>Emochoice ID</strong>
              </Table.Td>
              <Table.Td>{data.id}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>
                <strong>Name</strong>
              </Table.Td>
              <Table.Td>{data.name}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>
                <strong>Price</strong>
              </Table.Td>
              <Table.Td>${data.price}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>
                <strong>Category</strong>
              </Table.Td>
              <Table.Td>{data.category}</Table.Td>
            </Table.Tr>
            {Object.entries(data.custom_data).map(([key, value]) => (
              <Table.Tr>
                <Table.Td>
                  <strong>{toTitleCase(key)}</strong>
                </Table.Td>
                <Table.Td>
                  {typeof value == "string" ? value : value.join(", ")}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Container>
    </>
  );

  function toTitleCase(str: string) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
    });
  }
}
