import {
  Box,
  Button,
  ColorInput,
  Container,
  Divider,
  FileInput,
  Image,
  Modal,
  NumberInput,
  SegmentedControl,
  Space,
  Table,
  Text,
  TextInput,
  Textarea,
  Title,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconEye, IconX } from "@tabler/icons-react";
import React, { useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import pocketbase from "../../lib/database";
import { Product } from "../../lib/database/models";
import { setDocumentTitle, toTitleCase } from "../../lib/utils";
import classes from "./index.module.css";

export default function Product() {
  const { product } = useLoaderData() as { product: Product };
  const [customImage, setCustomImage] = React.useState<File | null>(null);
  const [image, setImage] = React.useState<File | null>(null);
  const [modalOpened, setModalOpened] = React.useState<boolean>(false);

  const initialValues: Record<string, unknown> = {
    quantity: 1,
  };

  const sizes = product.sizes.split(",");

  if (sizes.length > 0) initialValues["size"] = sizes[0];
  if (product.colors.length > 0) initialValues["color"] = product.expand.colors![0].hex;

  const form = useForm({ initialValues });

  useEffect(() => {
    setDocumentTitle(product.name);
    console.log(product.expand.colors![0].hex);

    if (modalOpened) {
      const userImage = document.createElement("img");
      const backgroundImage = document.createElement("img");

      if (customImage) {
        userImage.src = URL.createObjectURL(customImage);
        backgroundImage.src = product.images.length > 0 ? pocketbase.getFileUrl(product, product.images[0]) : "/images/no_image.png";
        backgroundImage.onload = () => {
          userImage.onload = () => {
            const canvas = document.getElementById("previewCanvas") as HTMLCanvasElement;
            if (canvas) {
              const ctx = canvas.getContext("2d");
              canvas.width = backgroundImage.width;
              canvas.height = backgroundImage.height;
              if (ctx) {
                ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
                ctx.drawImage(userImage, canvas.width / 6, canvas.height / 4.4, canvas.width / 2, canvas.height / 2);
              }
            }
          };
        };
      }
    }
  }, [modalOpened, customImage, product.name]);

  return (
    <Box>
      <Modal
        opened={modalOpened}
        onClose={() => {
          setModalOpened(false);
          setCustomImage(image);
        }}
        title={"Preview"}
        size="lg"
        centered
      >
        <Box>
          <Box display={"flex"} style={{ justifyContent: "center" }} w="100%">
            <canvas id="previewCanvas" style={{ maxWidth: "100%" }}></canvas>
          </Box>
          <Box display={"flex"} style={{ justifyContent: "center" }}>
            <Button
              variant="light"
              onClick={() => {
                setModalOpened(false);
                setCustomImage(image);
              }}
              style={{ margin: "10px" }}
            >
              Cancel
            </Button>
            <Button
              variant="filled"
              onClick={() => {
                setModalOpened(false);
                setImage(customImage);
              }}
              style={{ margin: "10px" }}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>
      <Container className={classes.overview}>
        <Box className={classes.imagebox}>
          <Image
            className={classes.image}
            src={product.images.length > 0 ? pocketbase.getFileUrl(product, product.images[0]) : "/images/no_image.png"}
          />
        </Box>
        <Box ml={30}>
          <Title mb={"xs"}>{product.name}</Title>
          <Title mb={"xl"} c={"emochoice-blue"} order={4}>
            {product.brand}
          </Title>
          <form onSubmit={form.onSubmit((values) => console.log(values))}>
            {!!product.sizes ? (
              <Box className={classes.input}>
                <Text>Size</Text>
                <Space w="md" />
                <SegmentedControl data={sizes} {...form.getInputProps("size")} />
              </Box>
            ) : null}
            {product.colors.length > 0 ? (
              <Box className={classes.input}>
                <Text>Color</Text>
                <Space w="md" />
                <ColorInput
                  required
                  disallowInput
                  withPicker={false}
                  withEyeDropper={false}
                  placeholder="Choose a color"
                  swatches={product.expand.colors!.map((color) => color.hex)}
                  {...form.getInputProps("color")}
                  onChange={(hex) => {
                    form.setFieldValue("color", hex);
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
            {product.bounding !== "" ? (
              <Box className={classes.input}>
                <Text>Your image</Text>
                <Space w="md" />
                <FileInput
                  id="fileInput"
                  maw={250}
                  accept="image/jpeg,image/png,image/gif,image/tiff,image/bmp,image/webp,image/svg+xml,image/vnd.microsoft.icon,image/heif,image/heic"
                  variant="default"
                  c={"emochoice-yellow"}
                  placeholder="Upload"
                  value={customImage}
                  onChange={(value) => {
                    setCustomImage(value);
                    if (value) setModalOpened(true);
                  }}
                />
                {image ? (
                  <Box display={"flex"}>
                    <Tooltip label="Remove image">
                      <UnstyledButton
                        style={{ marginLeft: "15%", display: "flex", alignItems: "center" }}
                        onClick={() => {
                          setCustomImage(null);
                          setImage(null);
                        }}
                      >
                        <IconX style={{ color: "red" }} stroke={1.5}></IconX>
                      </UnstyledButton>
                    </Tooltip>
                    <Tooltip label="Preview">
                      <UnstyledButton
                        style={{ marginLeft: "15%", display: "flex", alignItems: "center" }}
                        onClick={() => {
                          setModalOpened(true);
                        }}
                      >
                        <IconEye style={{ color: "#FCB918" }} stroke={1.5}></IconEye>
                      </UnstyledButton>
                    </Tooltip>
                  </Box>
                ) : null}
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
            <Table.Tr>
              <Table.Td>
                <strong>Category</strong>
              </Table.Td>
              <Table.Td>
                {product.category.length > 0 ? product.expand.category!.map((category) => category.name).join(", ") : "No category"}
              </Table.Td>
            </Table.Tr>
            {product.custom_data
              ? Object.entries(product.custom_data).map(([key, value]) => (
                  <Table.Tr>
                    <Table.Td>
                      <strong>{toTitleCase(key)}</strong>
                    </Table.Td>
                    <Table.Td>{value instanceof Array ? value.join(", ") : String(value)}</Table.Td>
                  </Table.Tr>
                ))
              : null}
          </Table.Tbody>
        </Table>
      </Container>
    </Box>
  );
}
