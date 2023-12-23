import { Box, Button, FileInput, Image, NumberInput, ScrollArea, Space, Table, Tabs, Text, Textarea, Title, rem } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconInfoCircle, IconNumber, IconShoppingCartPlus } from "@tabler/icons-react";
import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLoaderData, useLocation } from "react-router-dom";
import ProductCard from "../../components/Card";
import ColorButton from "../../components/ColorButton";
import ImageZoom from "../../components/ImageZoom";
import CustomImageModal from "../../components/Modal/CustomImage";
import pocketbase, { getProducts } from "../../lib/database";
import { Color, Product } from "../../lib/database/models";
import { List, useList } from "../../lib/list";
import { HTMLtoText, filterProducts, pasteImage, toTitleCase } from "../../lib/utils";
import classes from "./index.module.css";

export interface OrderData {
  color?: Color;
  quantity: number;
  request: string;
  fileInput?: File | null;
}

type BoundaryPoints = [number, number, number, number];

function preview(backgroundImage: HTMLImageElement, userImage: HTMLImageElement, boundaryPoints: BoundaryPoints) {
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

export default function Product() {
  const { product } = useLoaderData() as { product: Product };
  const [customImage, setCustomImage] = React.useState<File | null>(null);
  const [image, setImage] = React.useState<File | null>(null);
  const [modalState, setModalState] = React.useState({ open: false, fileUploaded: false });
  const [productImage, setProductImage] = React.useState<string>(
    product.images.length > 0 ? pocketbase.getFileUrl(product, product.images[0]) : "/images/no_image.png",
  );
  const [images, setImages] = React.useState<string[]>([]);
  const [relatedProducts, setRelatedProducts] = React.useState<Product[]>([]);
  const [bigImage, openBigImage] = React.useState(false);
  const { list, updateList } = useList();

  let user: OrderData | null = null;

  const location = useLocation();
  if (location.state) user = location.state as typeof user;

  const initialValues: OrderData = { quantity: 1, request: "" };

  let boundaryPoints = useMemo<BoundaryPoints>(
    () => (product.boundary ? (product.boundary.split(",").map((point) => Number(point)) as BoundaryPoints) : [0, 0, 0, 0]),
    [product.boundary],
  );

  if (product.colors.length > 0) initialValues.color = product.expand!.colors![0];
  if (product.boundary) {
    boundaryPoints = product.boundary.split(",").map((point) => Number(point)) as BoundaryPoints;
    initialValues.fileInput = null;
  }

  const form = useForm<OrderData>({ initialValues });

  const isMobile = useMediaQuery(`(max-width: 48em)`);

  useEffect(() => {
    setImages(product.images);
  }, [product.images]);

  useEffect(() => {
    setProductImage(product.images.length > 0 ? pocketbase.getFileUrl(product, product.images[0]) : "/images/no_image.png");
  }, [product]);

  useEffect(() => notifications.clean(), []);

  useEffect(() => {
    if (!user) return;
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
    getProducts().then((products) => {
      setRelatedProducts(filterProducts(products, product.category, 1));
    });
  }, [product.category]);

  useEffect(() => {
    if (!modalState.open) return;

    const userImage = document.createElement("img");
    const backgroundImage = document.createElement("img");

    if (!customImage) return;

    userImage.src = URL.createObjectURL(customImage);
    backgroundImage.src = product.images.length > 0 ? pocketbase.getFileUrl(product, product.images[0]) : "/images/no_image.png";
    backgroundImage.onload = () => (userImage.onload = () => preview(backgroundImage, userImage, boundaryPoints));
  }, [modalState.open, customImage, product, boundaryPoints]);

  const [scrollHeight, setScrollHeight] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollHeight(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  return (
    <Box w="80%" ml="auto" mr="auto">
      {bigImage && !isMobile && (
        <ImageZoom
          scrollHeight={scrollHeight}
          productImage={productImage}
          openBigImage={openBigImage}
          images={images}
          setProductImage={setProductImage}
          product={product}
        />
      )}

      <Helmet>
        <title>{product.name} - Emochoice</title>
        <meta name="description" content={HTMLtoText(product.description)} />
        <meta name="title" content={`${product.name} - Emochoice`} />
        <meta name="description" content={HTMLtoText(product.description)} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://v2.emochoice.ca/product/${product.id}`} />
        <meta property="og:title" content={`${product.name} - Emochoice`} />
        <meta property="og:description" content={HTMLtoText(product.description)} />
        <meta property="og:image" content={productImage} />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={`https://v2.emochoice.ca/product/${product.id}`} />
        <meta property="twitter:title" content={`${product.name} - Emochoice`} />
        <meta property="twitter:description" content={HTMLtoText(product.description)} />
        <meta property="twitter:image" content={productImage} />
      </Helmet>
      <CustomImageModal
        form={form}
        modalState={modalState}
        setModalState={setModalState}
        image={image}
        setImage={setImage}
        customImage={customImage}
        setCustomImage={setCustomImage}
      />
      <Box className={classes.overview}>
        <Box className={classes.imagebox}>
          <Image
            src={productImage}
            onClick={() => {
              !isMobile && openBigImage(!bigImage);
            }}
            style={{ cursor: "pointer" }}
          />
          {images.length > 1 ? (
            <ScrollArea mt="xl" mb="sm">
              <Box display={"flex"}>
                {images.map((image) => (
                  <Image
                    src={pocketbase.getFileUrl(product, image)}
                    onClick={() => setProductImage(pocketbase.getFileUrl(product, image))}
                    style={{ height: "100px", width: "auto", marginRight: "10px", cursor: "pointer", border: "1px solid #cccccc" }}
                  />
                ))}
              </Box>
            </ScrollArea>
          ) : null}
        </Box>
        <Box ml={30} maw={!isMobile ? "70%" : "90%"}>
          <Title mb={"xs"}>{product.name}</Title>
          <Box
            component="form"
            onSubmit={form.onSubmit((values) => {
              const { quantity, request, fileInput } = values;
              const color = product.expand?.colors?.find((color) => color.hex === values.color?.hex);
              const newList = new List(...list, {
                product,
                color,
                quantity,
                request,
                fileInput,
              });
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
              <Box className={classes.input} style={{ flexDirection: "column", alignItems: "start" }}>
                <Text mb="md">Color: {toTitleCase(form.values.color?.name) ?? ""}</Text>
                <Box display={"flex"} style={{ flexWrap: "wrap" }}>
                  {product.expand!.colors!.map((color) => (
                    <ColorButton
                      key={color.hex}
                      color={color}
                      onClick={() => {
                        form.setFieldValue("color", color);
                        const imageWithColor = product.images.filter((image) => image.startsWith(color.id));
                        if (imageWithColor.length < 0) return;
                        const imageFile = imageWithColor[0];
                        setProductImage(imageFile ? pocketbase.getFileUrl(product, imageFile) : "/images/no_image.png");
                        setImages(imageWithColor);
                      }}
                    />
                  ))}
                </Box>
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
            {product.customizable ? (
              <Box className={classes.input}>
                <Text>Your image</Text>
                <Space w="md" />
                <FileInput
                  id="fileInput"
                  maw={250}
                  accept="image/jpeg,image/png,image/gif,image/tiff,image/bmp,image/webp,image/svg+xml,image/vnd.microsoft.icon,image/heif,image/heic"
                  variant="default"
                  c={"emochoice-yellow"}
                  // @ts-ignore
                  placeholder="Upload"
                  {...form.getInputProps("fileInput")}
                  value={customImage}
                  onChange={(value) => {
                    setCustomImage(value);
                    if (value)
                      if (product.boundary) setModalState({ open: true, fileUploaded: true });
                      else form.setFieldValue("fileInput", customImage);
                  }}
                />
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
              <Button variant="filled" className={classes.input} size="md" radius="md" type="submit">
                Add to List
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box mt="xl">
        <Tabs defaultValue="gallery">
          <Tabs.List>
            <Tabs.Tab value="gallery" leftSection={<IconInfoCircle style={{ width: rem(12), height: rem(12) }} />}>
              Description
            </Tabs.Tab>
            <Tabs.Tab value="messages" leftSection={<IconNumber style={{ width: rem(12), height: rem(12) }} />}>
              Technical Details
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="gallery">
            <Box className={classes.information}>
              <div dangerouslySetInnerHTML={{ __html: `${product.description}` }} />
            </Box>
          </Tabs.Panel>
          <Tabs.Panel value="messages">
            <Box className={classes.information}>
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
                      {product.category.length > 0 ? product.expand!.category!.map((category) => category.name).join(", ") : "No category"}
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
            </Box>
          </Tabs.Panel>
        </Tabs>
      </Box>
      {relatedProducts.length > 0 ? (
        <Box mt="xl">
          <Title order={2} mb="sm">
            You may also like
          </Title>
          <ScrollArea>
            <Box display={"flex"}>
              {relatedProducts
                .filter((p) => p.id != product.id)
                .map((product) => (
                  <ProductCard inProductPage={true} product={product} />
                ))}
            </Box>
          </ScrollArea>
        </Box>
      ) : null}
    </Box>
  );
}
