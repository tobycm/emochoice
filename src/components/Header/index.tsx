import {
  ActionIcon,
  Autocomplete,
  Avatar,
  Box,
  Burger,
  Container,
  Drawer,
  Group,
  Image,
  Indicator,
  NavLink,
  Popover,
  Space,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { IconCheck, IconPhone, IconPhoto, IconSearch, IconShoppingCart, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "preact/hooks";
import { Link, useNavigate } from "react-router-dom";
import { useATLState } from "../../lib/atl_popover";
import pocketbase, { getDropdownMenuList, getProducts } from "../../lib/database";
import { Item, useList } from "../../lib/list";
import { Tree, makeDropdownTree, toTitleCase } from "../../lib/utils";
import { ProductWithKeywords, searchProducts } from "../../lib/utils/search";
import DesktopDropdown from "../Dropdown/Desktop";
import MobileDropdown from "../Dropdown/Mobile";
import classes from "./index.module.css";

export default function Header() {
  const ATL = useATLState();
  const [drawerOpened, { toggle: toggleDrawer }] = useDisclosure(false);
  const [showIndicator, setShowIndicator] = useState(false);
  const { list } = useList();

  const [products, setProducts] = useState<ProductWithKeywords[]>([]);
  const [colors, setColors] = useState<string[]>([]);

  useEffect(() => {
    getProducts().then((products) =>
      setProducts(
        products.map(
          (product) => (
            (product.keywords =
              `${product.name} ${(product.expand.colors ?? []).map((color) => color.name).join(" ")} ${product.custom_id} ${(product.expand.types ?? []).map((type) => type.name).join(" ")} ${(product.expand.category ?? []).map((category) => category.name).join(" ")} ${product.expand.brand.name}`.toLowerCase()),
            product
          ),
        ) as ProductWithKeywords[],
      ),
    );
  }, []);

  useEffect(() => {
    if (!products) return;

    const colors: string[] = [];

    products.forEach((product) => product.expand.colors?.forEach((color) => colors.includes(color.name) && colors.push(color.name)));

    setColors(colors);
  }, [products]);

  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 36em)");

  const [dropdownTree, setDropdownTree] = useState(new Tree());

  useEffect(() => {
    getDropdownMenuList().then((items) => {
      const existingItems: string[] = [];

      for (const item of items)
        setDropdownTree((prev) => {
          if (existingItems.includes(item.expand?.parent?.name ?? "")) return prev;

          const [tree, eItems] = makeDropdownTree(item, items);

          existingItems.push(...eItems);

          return prev.set(item.expand!.parent!, tree);
        });
    });
  }, []);

  function search(search: string = searchQuery) {
    search = search.trim();

    const url = new URL(window.location.href);

    url.searchParams.set("search", search);

    navigate("/catalog" + url.search);
  }

  const [searchResults, setSearchResults] = useState<string[]>([]);

  useEffect(() => {
    setSearchResults(searchProducts(products, searchQuery, colors));
  }, [searchQuery, products, colors]);

  const [product, setProduct] = useState<Item | null>(null);

  const [productImage, setProductImage] = useState<string | null>(null);

  useEffect(() => {
    setShowIndicator(list.length > 0);

    if (list.length == 0) return;

    const item = list[list.length - 1];
    setProduct(item);
    const selectedImage = item.color ? item.product.expand.images?.filter((image) => image.color == item.color?.id) ?? [] : [];
    if (selectedImage.length == 0)
      return setProductImage(pocketbase.getFileUrl(item.product.expand.images![0], item.product.expand.images![0].image) ?? "/images/no_image.png");
    setProductImage(pocketbase.getFileUrl(selectedImage[0], selectedImage[0].image));
  }, [list]);

  return (
    <Box className={classes.header}>
      <Container className={classes.mainSection}>
        <Drawer opened={drawerOpened} onClose={toggleDrawer} title={"Menu"} size="xs">
          {/** Categories "dropdown" on mobile */}
          <MobileDropdown closeDrawer={toggleDrawer} tree={dropdownTree} />
          <Link to="/gallery" style={{ textDecoration: "none", color: "black" }} onClick={toggleDrawer}>
            <NavLink label="Gallery" leftSection={<IconPhoto size="1rem" stroke={1.5} />} />
          </Link>
          <Link to="/contact" style={{ textDecoration: "none", color: "black" }} onClick={toggleDrawer}>
            <NavLink label="Contact" leftSection={<IconPhone size="1rem" stroke={1.5} />} />
          </Link>
        </Drawer>
        <Group justify="space-between" display="flex" style={{ alignItems: "center", flexDirection: "column" }}>
          <Box w={"100%"} display={"flex"} hiddenFrom="xs" style={{ alignItems: "center" }}>
            <Box display={"flex"}>
              <Burger opened={drawerOpened} onClick={toggleDrawer} size="sm" maw={isMobile ? "28px" : "auto"} />
              <Space w="44px" visibleFrom="mn" />
            </Box>
            <Link to={"/"} style={{ display: "flex", justifyContent: "center", marginLeft: "6px" }}>
              <Image src={"/images/full_logo.svg"} mih={60} mah={70} h="7vh" w={"auto"} style={{ pointerEvents: "none" }} />
            </Link>
          </Box>

          <Box w={"100%"} display={"flex"} style={{ justifyContent: "space-between", alignItems: "center" }}>
            <Box w={"85%"} display={"flex"} hiddenFrom="xs" style={{ justifyContent: "space-between" }}>
              <Autocomplete
                radius="xl"
                w={"100%"}
                mr={10}
                placeholder="Model ID, brand, category, color, types, etc..."
                id={"searchbarMobile"}
                data={searchResults}
                filter={() => searchResults.map((result) => ({ value: result, label: result }))}
                onKeyDown={(e: KeyboardEvent) => {
                  if (!(e.key == "Enter")) return;
                  search();
                  (e.currentTarget as HTMLInputElement).blur();
                }}
                onOptionSubmit={search}
                onChange={setSearchQuery}
                limit={10}
              />

              <ActionIcon variant="filled" radius="lg" size="lg" mr={10} ml={isMobile ? "auto" : "none"} onClick={() => search()}>
                <IconSearch style={{ width: "60%", height: "60%" }} stroke={3} />
              </ActionIcon>
            </Box>
            <Box display={"flex"} style={{ justifyContent: "flex-end", maxWidth: isMobile ? "78px" : "min-content" }}>
              <Autocomplete
                radius="xl"
                w={220}
                mr={10}
                placeholder="What are you looking for?"
                id={"searchbarWide"}
                visibleFrom={"xs"}
                data={searchResults}
                filter={() => searchResults.map((result) => ({ value: result, label: result }))}
                onKeyDown={(e: KeyboardEvent) => {
                  if (!(e.key == "Enter")) return;
                  search();
                  (e.currentTarget as HTMLInputElement).blur();
                }}
                onOptionSubmit={search}
                onChange={setSearchQuery}
                limit={10}
              />
              <ActionIcon variant="filled" radius="lg" size="lg" mr={10} ml={isMobile ? "auto" : "none"} onClick={() => search()} visibleFrom="mn">
                <IconSearch style={{ width: "60%", height: "60%" }} stroke={3} />
              </ActionIcon>
              <Link to="/list">
                <Popover opened={ATL.current} withArrow arrowSize={15} radius={15}>
                  <Popover.Target>
                    {showIndicator ? (
                      <Indicator inline label={list.length} color="red" size={16}>
                        <ActionIcon variant="red" radius="lg" size="lg">
                          <IconShoppingCart style={{ width: "60%", height: "60%" }} stroke={3} />
                        </ActionIcon>
                      </Indicator>
                    ) : (
                      <ActionIcon variant="red" radius="lg" size="lg">
                        <IconShoppingCart style={{ width: "60%", height: "60%" }} stroke={3} />
                      </ActionIcon>
                    )}
                  </Popover.Target>
                  <Popover.Dropdown>
                    <Box>
                      <Group display="flex" style={{ justifyContent: "space-between", alignItems: "center" }} w="100%" mt="xs">
                        <Box display="flex" style={{ justifyContent: "space-between", alignItems: "center" }}>
                          <Avatar variant="filled" radius="xl" size="sm" color="emochoice-green">
                            <IconCheck stroke={3} size="1.5rem" />
                          </Avatar>
                          <Title order={4} ml="sm">
                            Added to List!
                          </Title>
                        </Box>
                        <IconX onClick={() => ATL.set(false)} style={{ marginLeft: "auto", cursor: "pointer" }} />
                      </Group>
                      <Group display="flex" style={{ justifyContent: "space-between" }} w="max-content" mt="md">
                        <Image src={productImage} w={100} />
                        <Box>
                          <Text fw={600} maw={200} lineClamp={2}>
                            {product?.product.name}
                            {product?.product.custom_id && ` - ${product?.product.custom_id}`}
                          </Text>
                          {product?.color && (
                            <Text c="grey" style={{ fontSize: "15px" }}>
                              Color: {toTitleCase(product?.color.name)}
                            </Text>
                          )}
                          {product?.type && (
                            <Text c="grey" style={{ fontSize: "15px" }}>
                              Type: {product?.type.name}
                            </Text>
                          )}
                          <Text c="grey" style={{ fontSize: "15px" }}>
                            Quantity: {product?.quantity}
                          </Text>
                        </Box>
                      </Group>
                    </Box>
                  </Popover.Dropdown>
                </Popover>
              </Link>
            </Box>
          </Box>
        </Group>
      </Container>
      <Container>
        <DesktopDropdown tree={dropdownTree} />
      </Container>
    </Box>
  );
}
