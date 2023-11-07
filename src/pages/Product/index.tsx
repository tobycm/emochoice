import {
  Box,
  Button,
  ColorSwatch,
  Container,
  Divider,
  FileInput,
  Image,
  Modal,
  NumberInput,
  Space,
  Table,
  Text,
  Textarea,
  Title,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Notifications, notifications } from "@mantine/notifications";
import { IconEye, IconShoppingCartPlus, IconX } from "@tabler/icons-react";
import React, { useEffect, useMemo } from "react";
import { useLoaderData, useLocation } from "react-router-dom";
import pocketbase from "../../lib/database";
import { Color, Product, ProductColor } from "../../lib/database/models";
import { Item, List, useList } from "../../lib/list";
import { pasteImage, setDocumentTitle, toTitleCase } from "../../lib/utils";
import classes from "./index.module.css";

interface OrderData {
  color?: Color;
  quantity: number;
  request: string;
  fileInput?: File | null;
}

type BoundaryPoints = [number, number, number, number];

export default function Product() {
  const { product } = useLoaderData() as { product: Product };
  const [customImage, setCustomImage] = React.useState<File | null>(null);
  const [image, setImage] = React.useState<File | null>(null);
  const [modalState, setModalState] = React.useState({ open: false, fileUploaded: false });
  const [productImage, setProductImage] = React.useState<string>(
    product.images.length > 0 ? pocketbase.getFileUrl(product, product.images[0]) : "/images/no_image.png",
  );
  const { list, updateList } = useList();

  let user = useMemo<OrderData>(() => ({ quantity: 0, request: "" }), []);

  const location = useLocation();
  if (location.state) user = location.state as typeof user;

  const initialValues: OrderData = { quantity: 0, request: "" };

  let boundaryPoints = useMemo<BoundaryPoints>(
    () => (product.boundary ? (product.boundary.split(",").map((point) => Number(point)) as BoundaryPoints) : [0, 0, 0, 0]),
    [product.boundary],
  );

  if (product.colors.length > 0) initialValues.color = product.expand.colors![0];
  if (product.boundary) {
    boundaryPoints = product.boundary.split(",").map((point) => Number(point)) as BoundaryPoints;
    initialValues.fileInput = null;
  }

  const form = useForm<OrderData>({ initialValues });

  useEffect(() => setDocumentTitle(product.name), [product.name]);

  useEffect(() => notifications.clean());

  useEffect(() => {
    if (user.color) form.setFieldValue("color", user.color);
    if (user.quantity) form.setFieldValue("quantity", user.quantity);
    if (user.request) form.setFieldValue("request", user.request);
    if (user.fileInput) {
      form.setFieldValue("fileInput", user.fileInput);
      setCustomImage(user.fileInput);
      setImage(user.fileInput);
    }
  }, [user, form]);

  useEffect(() => {
    if (!modalState.open) return;

    const userImage = document.createElement("img");
    const backgroundImage = document.createElement("img");

    if (!customImage) return;

    function preview() {
      const canvas = document.getElementById("previewCanvas") as HTMLCanvasElement | null;
      if (!canvas) return;
      canvas.width = backgroundImage.width;
      canvas.height = backgroundImage.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

      pasteImage(
        canvas,
        userImage,
        {
          xOffset: boundaryPoints[0],
          maxWidth: boundaryPoints[1],
          maxHeight: boundaryPoints[2],
          yOffset: boundaryPoints[3],
        },
        backgroundImage.height,
      );
    }

    userImage.src = URL.createObjectURL(customImage);
    backgroundImage.src = product.images.length > 0 ? pocketbase.getFileUrl(product, product.images[0]) : "/images/no_image.png";
    backgroundImage.onload = () => (userImage.onload = preview);
  }, [modalState, customImage, product, boundaryPoints]);
  return (
    <Box>
      <Notifications limit={5} />
      <Modal
        opened={modalState.open}
        onClose={() => {
          setModalState({ open: false, fileUploaded: modalState.fileUploaded });
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
          {modalState.fileUploaded ? (
            <>
              <Box mb={"md"}>
                <Text>
                  If the image is stretched excessively or does not fully occupy the available space, you may want to consider adjusting the scaling
                  on your device.
                </Text>
              </Box>
              <Box display={"flex"} style={{ justifyContent: "center" }}>
                <Button
                  variant="light"
                  onClick={() => {
                    setModalState({ open: false, fileUploaded: modalState.fileUploaded });
                    setCustomImage(image);
                  }}
                  style={{ margin: "10px" }}
                >
                  Cancel
                </Button>
                <Button
                  variant="filled"
                  onClick={() => {
                    setModalState({ open: false, fileUploaded: modalState.fileUploaded });
                    setImage(customImage);
                    form.setFieldValue("fileInput", customImage);
                  }}
                  style={{ margin: "10px" }}
                >
                  Submit
                </Button>
              </Box>
            </>
          ) : null}
        </Box>
      </Modal>
      <Container className={classes.overview}>
        <Box className={classes.imagebox}>
          <Image className={classes.image} src={productImage} />
        </Box>
        <Box ml={30}>
          <Title mb={"xs"}>{product.name}</Title>
          <Box
            component="form"
            onSubmit={form.onSubmit((values) => {
              const { quantity, request, fileInput } = values;
              if (!quantity) return;

              const color: ProductColor | undefined = product.expand.colors?.find((color) => color.hex === values.color?.hex);
              const item: Item = {
                product,
                color,
                quantity,
                request,
                fileInput,
              };
              const newList = new List(...list, item);
              updateList(newList);

              notifications.show({
                title: "Success",
                message: "Item added to list!",
                color: "emochoice-green",
                icon: <IconShoppingCartPlus stroke={2}></IconShoppingCartPlus>,
                autoClose: 3000,
                withCloseButton: true,
              });
            })}
          >
            <Title mb={"xl"} c={"emochoice-blue"} order={4}>
              {product.brand}
            </Title>
            {product.colors.length > 0 ? (
              <Box className={classes.input}>
                <Text>Color</Text>
                <Space w="md" />
                {product.expand.colors!.map((color) => (
                  <Tooltip label={color.name} openDelay={500}>
                    <ColorSwatch
                      key={color.hex}
                      color={color.hex}
                      size={30}
                      mr={10}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        form.setFieldValue("color", color);
                        const imageFile = product.images.find((image) => image.includes(color.name.toLowerCase()));
                        setProductImage(imageFile ? pocketbase.getFileUrl(product, imageFile) : "/images/no_image.png");
                      }}
                    />
                  </Tooltip>
                ))}
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
            {product.boundary !== "" ? (
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
                  {...form.getInputProps("fileInput")}
                  value={customImage}
                  onChange={(value) => {
                    setCustomImage(value);
                    if (value) setModalState({ open: true, fileUploaded: true });
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
                          setModalState({ open: true, fileUploaded: false });
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
              <Textarea
                autosize
                className={classes.textarea}
                minRows={3}
                maxRows={4}
                placeholder="Feel free to ask!"
                {...form.getInputProps("request")}
              />
            </Box>
            <Box display="flex">
              <Button variant="filled" className={classes.input} type="submit">
                Add to List
              </Button>
            </Box>
          </Box>
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
