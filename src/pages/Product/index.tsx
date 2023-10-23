import {
  Box,
  Button,
  ColorInput,
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
  Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import React from "react";
import { useLoaderData } from "react-router-dom";
import pocketbase from "../../lib/database";
import { Product } from "../../lib/database/models";
import { toTitleCase } from "../../lib/utils";
import classes from "./index.module.css";

export default function Product() {
  const { product } = useLoaderData() as { product: Product };

  const initialValues: Record<string, any> = {};

  let sizesAvailable;
  let colorsAvailable;
  let uploadImage;

  const [imageIndex, setImage] = React.useState<number>(0);

  if (product.custom_data) {
    sizesAvailable = !!product.custom_data["sizes"];
    colorsAvailable = !!product.custom_data["colors"];
    uploadImage = product.custom_data["upload_image"] == null;
  }
  if (sizesAvailable) initialValues["size"] = product.custom_data!["sizes"][0];
  initialValues["quantity"] = 1;
  if (colorsAvailable) {
    initialValues["color"] = Object.values<string>(product.custom_data?.["colors"])[imageIndex];
  }

  const form = useForm({ initialValues });

  return (
    <Box>
      <Container className={classes.overview}>
        <Box className={classes.imagebox}>
          <Image className={classes.image} src={product.image ? pocketbase.getFileUrl(product, product.image[imageIndex]) : "/images/no_image.png"} />
        </Box>
        <Box ml={30}>
          <Title mb={"xs"}>{product.name}</Title>
          <Title mb={"xl"} c={"emochoice-blue"} order={4}>
            {product.brand}
          </Title>
          <form onSubmit={form.onSubmit((values) => console.log(values))}>
            {sizesAvailable ? (
              <Box className={classes.input}>
                <Text>Size</Text>
                <Space w="md" />
                <SegmentedControl data={product.custom_data!["sizes"]} {...form.getInputProps("size")} />
              </Box>
            ) : null}
            {colorsAvailable ? (
              <Box className={classes.input}>
                <Text>Color</Text>
                <Space w="md" />
                <ColorInput
                  required
                  disallowInput
                  withPicker={false}
                  withEyeDropper={false}
                  placeholder="Choose a color"
                  swatches={Object.values<string>(product.custom_data?.["colors"])}
                  {...form.getInputProps("color")}
                  onChange={(color) => {
                    setImage(Object.values<string>(product.custom_data?.["colors"]).indexOf(color));
                    form.setFieldValue("color", color);
                  }}
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
            {uploadImage ? (
              <Box className={classes.input}>
                <Text>Your image</Text>
                <Space w="md" />
                <FileInput accept="image/png,image/jpeg" variant="default" c={"emochoice-yellow"} placeholder="Upload" />
              </Box>
            ) : null}
            <Box className={classes.input}>
              <Text>Request</Text>
              <Space w="md" />
              <Textarea autosize className={classes.textarea} minRows={2} maxRows={4} placeholder="Feel free to ask!" />
            </Box>
            <Box className={classes.input}>
              <Text>Phone number or Email</Text>
              <Space w="md" />
              <TextInput w={215} placeholder="your@email.com" required />
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
        <div dangerouslySetInnerHTML={{ __html: `${product.description}` }} />
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
                <strong>Brand</strong>
              </Table.Td>
              <Table.Td>{product.brand}</Table.Td>
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
            <Table.Tr>
              <Table.Td>
                <strong>Category</strong>
              </Table.Td>
              <Table.Td>{product.expand.category.map((category) => category.name).join(", ")}</Table.Td>
            </Table.Tr>
            {product.custom_data ? (
              <>
                {Object.entries(product.custom_data!)
                  .filter(([key]) => key != "upload_image")
                  .map(([key, value]) => (
                    <Table.Tr>
                      <Table.Td>
                        <strong>{toTitleCase(key)}</strong>
                      </Table.Td>
                      <Table.Td>
                        {typeof value == "string" ? (
                          value
                        ) : key == "colors" ? (
                          <Box display={"flex"}>
                            {Object.entries<string>(product.custom_data?.["colors"]).map(([colorName, hex]) => (
                              <Tooltip label={toTitleCase(colorName)} openDelay={500}>
                                <Box w={"2vh"} h={"2vh"} mr={5} style={{ backgroundColor: hex, border: "1px solid grey" }}></Box>
                              </Tooltip>
                            ))}
                          </Box>
                        ) : (
                          value.join(", ")
                        )}
                      </Table.Td>
                    </Table.Tr>
                  ))}
              </>
            ) : null}
          </Table.Tbody>
        </Table>
      </Container>
    </Box>
  );
}
