import {
  Badge,
  Box,
  Button,
  FileInput,
  Flex,
  Image,
  NativeSelect,
  NumberInput,
  ScrollArea,
  Table,
  Tabs,
  Text,
  Textarea,
  Title,
  rem,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconInfoCircle, IconNumber } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLoaderData, useLocation, useNavigate } from "react-router-dom";
import MultiColorButton from "../../components/ColorButton/Multi";
import SingleColorButton from "../../components/ColorButton/Single";
import ImageZoom from "../../components/ImageZoom";
import CustomImageModal from "../../components/Modal/CustomImage";
import ProductCard from "../../components/ProductCard";
import { useATLState } from "../../lib/atl_popover";
import pocketbase, { getProducts } from "../../lib/database";
import { Product as DProduct, ProductColor, ProductImage, ProductType } from "../../lib/database/models";
import { List, useList } from "../../lib/list";
import { HTMLtoText, filterProducts, pasteImage, scrollToTop, toTitleCase } from "../../lib/utils";
import classes from "./index.module.css";

// TODO: keep refactoring

export interface OrderData {
  color?: ProductColor;
  type?: ProductType;
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
  const atlState = useATLState();
  const { product } = useLoaderData() as { product: DProduct };

  const products = useQuery({ queryKey: ["products"], queryFn: getProducts });

  const initialValues: OrderData = { quantity: 1, request: "" };

  let boundaryPoints = useMemo<BoundaryPoints>(
    () => (product.boundary ? (product.boundary.split(",").map((point) => Number(point)) as BoundaryPoints) : [0, 0, 0, 0]),
    [product.boundary],
  );

  if (product.colors.length > 0) initialValues.color = product.expand!.colors![0];
  if (product.types.length > 0) initialValues.type = product.expand!.types![0];
  if (product.boundary) {
    boundaryPoints = product.boundary.split(",").map((point) => Number(point)) as BoundaryPoints;
    initialValues.fileInput = null;
  }

  const form = useForm<OrderData>({ initialValues });

  const [customImage, setCustomImage] = useState<File | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [modalState, setModalState] = useState({ open: false, fileUploaded: false });
  const [productImage, setProductImage] = useState<string>(
    product.images.length > 0 ? pocketbase.getFileUrl(product.expand.images![0], product.expand.images![0].image) : "/images/no_image.png",
  );

  const images = useMemo<ProductImage[]>(() => {
    if (!product.expand.images) return [];

    let images = product.expand.images;

    if (form.values.color) images = images.filter((image) => image.color === form.values.color?.id);
    if (form.values.type) images = images.filter((image) => image.type === form.values.type?.id);

    if (images.length === 0) setProductImage("/images/no_image.png");
    else setProductImage(pocketbase.getFileUrl(images[0], images[0].image));

    return images;
  }, [product.expand.images, form.values.color, form.values.type]);

  const relatedProducts = useMemo<DProduct[]>(() => {
    if (!products.data) return [];
    return filterProducts(products.data, product.category, 1);
  }, [products.data]);

  const [bigImage, openBigImage] = useState(false);
  const { list, updateList } = useList();
  const navigate = useNavigate();

  let user: OrderData | null = null;

  const location = useLocation();

  const isMobile = useMediaQuery(`(max-width: 48em)`);

  useEffect(() => {
    setProductImage(
      product.images.length > 0 ? pocketbase.getFileUrl(product.expand.images![0], product.expand.images![0].image) : "/images/no_image.png",
    );
  }, [product]);

  useEffect(() => {
    notifications.clean();
    if (location.state) user = location.state as typeof user;
    if (product.hidden) navigate("/catalog", { replace: true });
  }, []);

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
    if (!modalState.open) return;

    const userImage = document.createElement("img");
    const backgroundImage = document.createElement("img");

    if (!customImage) return;

    userImage.src = URL.createObjectURL(customImage);
    backgroundImage.src =
      product.images.length > 0 ? pocketbase.getFileUrl(product.expand.images![0], product.expand.images![0].image) : "/images/no_image.png";
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

  function startATLPopover() {
    atlState.set(false);
    atlState.set(true);
  }

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
        <title>
          {product.name}
          {product.custom_id && ` - ${product.custom_id}`} - Emochoice
        </title>
        <meta name="description" content={HTMLtoText(product.description)} />
        <meta name="title" content={`${product.name}${product.custom_id && ` - ${product.custom_id}`} - Emochoice`} />
        <meta name="description" content={HTMLtoText(product.description)} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://emochoice.ca/product/${product.id}`} />
        <meta property="og:title" content={`${product.name}${product.custom_id && ` - ${product.custom_id}`} - Emochoice`} />
        <meta property="og:description" content={HTMLtoText(product.description)} />
        <meta property="og:image" content={productImage} />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={`https://emochoice.ca/product/${product.id}`} />
        <meta property="twitter:title" content={`${product.name}${product.custom_id && ` - ${product.custom_id}`} - Emochoice`} />
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
          {images.length > 1 && (
            <ScrollArea mt="xl" mb="sm">
              <Box display={"flex"} mb="md">
                {images.map((image) => (
                  <Image
                    src={pocketbase.getFileUrl(image, image.image, { thumb: "0x100" })}
                    onClick={() => setProductImage(pocketbase.getFileUrl(image, image.image))}
                    style={{ height: "100px", width: "auto", marginRight: "10px", cursor: "pointer", border: "1px solid #cccccc" }}
                  />
                ))}
              </Box>
            </ScrollArea>
          )}
        </Box>
        <Box ml={30} maw={!isMobile ? "70%" : "90%"}>
          <Title mb={"xs"}>
            {product.name}
            {product.custom_id && ` - ${product.custom_id}`}
          </Title>
          <Title c={"emochoice-blue"} order={4}>
            {product.expand.brand.name}
          </Title>
          {product.tags.includes("on_sale") && (
            <Badge size="xl" mt="md" c="red">
              On Sale
            </Badge>
          )}
          <Box
            mt="xl"
            component="form"
            onSubmit={form.onSubmit((values) => {
              const { quantity, request, fileInput } = values;
              const color = product.expand?.colors?.find((color) => color.hex === values.color?.hex);
              const type = product.expand?.types?.find((type) => type.name === values.type?.name);
              const newList = new List(...list, {
                product,
                color,
                type,
                quantity,
                request,
                fileInput,
              });
              updateList(newList);
              startATLPopover();
              scrollToTop();
            })}
          >
            {product.colors.length > 0 && (
              <Box className={classes.input} style={{ flexDirection: "column", alignItems: "start" }}>
                <Text mb="md">Color: {toTitleCase(form.values.color?.name) ?? ""}</Text>
                <Box display={"flex"} style={{ flexWrap: "wrap" }}>
                  {product.expand!.colors!.map((color) =>
                    !color.hex.includes(",") ? (
                      <SingleColorButton key={color.hex} color={color} onClick={() => form.setFieldValue("color", color)} />
                    ) : (
                      <MultiColorButton key={color.hex} color={color} onClick={() => form.setFieldValue("color", color)} />
                    ),
                  )}
                </Box>
              </Box>
            )}
            {product.expand?.types && (
              <Box className={classes.input}>
                <Text mr="md">Type</Text>
                <NativeSelect
                  data={product.expand.types.map((type) => type.name)}
                  onChange={(e) => {
                    const type = product.expand?.types?.find((type) => type.name === e.currentTarget.value);
                    if (!type) return;
                    form.setFieldValue("type", type);
                  }}
                />
              </Box>
            )}
            <Box className={classes.input}>
              <Text mr={"md"}>Quantity</Text>
              <NumberInput
                style={{ width: "180px" }}
                placeholder="Between 1 and 99"
                clampBehavior="strict"
                min={1}
                max={99}
                {...form.getInputProps("quantity")}
              />
            </Box>
            {product.customizable && (
              <Box className={classes.input}>
                <Text mr={"md"}>Your image</Text>
                <FileInput
                  id="fileInput"
                  maw={250}
                  accept="image/png,image/jpeg,image/gif,image/webp,image/svg+xml"
                  variant="default"
                  c={"emochoice-yellow"}
                  placeholder="Upload"
                  {...form.getInputProps("fileInput")}
                  value={customImage}
                  onChange={(value) => {
                    setCustomImage(value);
                    if (!value) return;
                    if (product.boundary) setModalState({ open: true, fileUploaded: true });
                    else form.setFieldValue("fileInput", value);
                  }}
                />
              </Box>
            )}
            <Box className={classes.input}>
              <Text mr={"md"}>Request</Text>
              <Textarea
                autosize
                className={classes.textarea}
                minRows={3}
                maxRows={4}
                placeholder="Feel free to ask!"
                {...form.getInputProps("request")}
              />
            </Box>
            <Flex miw="150" maw="225" direction="column">
              <Button variant="filled" disabled={product.tags.includes("out_of_stock")} mb="xs" size="md" radius="md" type="submit">
                {product.tags.includes("out_of_stock") ? "Out of Stock" : "Add to list"}
              </Button>
              <Text c="gray" ta="center" fz="md">
                Price will be discussed later
              </Text>
            </Flex>
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
                    <Table.Td>{product.expand.brand.name}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>
                      <strong>Name</strong>
                    </Table.Td>
                    <Table.Td>
                      {product.name}
                      {product.custom_id && ` - ${product.custom_id}`}
                    </Table.Td>
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
                          <Table.Td>{value}</Table.Td>
                        </Table.Tr>
                      ))
                    : null}
                </Table.Tbody>
              </Table>
            </Box>
          </Tabs.Panel>
        </Tabs>
      </Box>
      {relatedProducts.length > 0 && (
        <Box mt="xl">
          <Title order={2} mb="sm">
            You may also like
          </Title>
          <ScrollArea>
            <Box display={"flex"}>
              {relatedProducts
                .filter((p) => p.id != product.id && !p.hidden)
                .map((product) => (
                  <ProductCard inProductPage={true} product={product} />
                ))}
            </Box>
          </ScrollArea>
        </Box>
      )}
    </Box>
  );
}
