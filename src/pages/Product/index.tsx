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
import { useLoaderData } from "react-router-dom";
import { Product } from "../../lib/database/models";
import classes from "./index.module.css";

export default function Product() {
  const { product, category } = useLoaderData() as { product: Product; category: string[] };

  console.log(product);
  const initialValues: Record<string, any> = {};

  let sizesAvailable = false;

  if (product.custom_data) {
    sizesAvailable = product.custom_data["sizes"] ? true : false;
  }
  if (sizesAvailable) initialValues["size"] = product.custom_data!["sizes"][0];

  const form = useForm({ initialValues });

  return (
    <Box>
      <Container className={classes.overview}>
        <Image className={classes.image} src={"https://m.media-amazon.com/images/I/71wjKdsRbLL.jpg"}></Image>
        <Box ml={30} mt={10}>
          <Title>{product.name}</Title>
          <Space h="md" />
          {/* <Title style={{ color: "#228be6" }}>${data.price}</Title> */}
          <form onSubmit={form.onSubmit((values) => console.log(values))}>
            {sizesAvailable ? (
              <Box className={classes.input}>
                <Text>Size</Text>
                <Space w="md" />
                <SegmentedControl
                  data={(product.custom_data!.size as string[]).map((size) => ({
                    label: size,
                    value: size,
                  }))}
                  {...form.getInputProps("size")}
                />
              </Box>
            ) : null}
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
              <FileInput accept="image/png,image/jpeg" variant="filled" placeholder="Upload" />
            </Box>
            <Box className={classes.input}>
              <Text>Request</Text>
              <Space w="md" />
              <Textarea autosize className={classes.textarea} minRows={2} maxRows={4} placeholder="Feel free to ask!" />
            </Box>
            <Box className={classes.input}>
              <Text>Phone number or Email</Text>
              <Space w="md" />
              <TextInput w={215} placeholder="your@email.com" />
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
        <Text>{product.description}</Text>
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
              <Table.Td>{product.id}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>
                <strong>Name</strong>
              </Table.Td>
              <Table.Td>{product.name}</Table.Td>
            </Table.Tr>
            {/* <Table.Tr>
              <Table.Td>
                <strong>Price</strong>
              </Table.Td>
              <Table.Td>${data.price}</Table.Td>
            </Table.Tr> */}
            {product.category.length > 0 ? (
              <Table.Tr>
                <Table.Td>
                  <strong>Category</strong>
                </Table.Td>
                <Table.Td>{category.join(", ")}</Table.Td>
              </Table.Tr>
            ) : null}

            {/* {Object.entries(product.custom_data).map(([key, value]) => (
              <Table.Tr>
                <Table.Td>
                  <strong>{toTitleCase(key)}</strong>
                </Table.Td>
                <Table.Td>{typeof value == "string" ? value : value.join(", ")}</Table.Td>
              </Table.Tr>
            ))} */}
          </Table.Tbody>
        </Table>
      </Container>
    </Box>
  );
}
