import { Box, Button, Checkbox, InputBase, Modal, NavLink, Pill, ScrollArea, Text, Title, UnstyledButton } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { IconCategory, IconColorFilter, IconFilter, IconIcons, IconSearchOff } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import ProductCard from "../../components/Card";
import SmallChangeHelmet from "../../components/Helmets/SmallChangeHelmet";
import { getProducts } from "../../lib/database";
import { Product } from "../../lib/database/models";
import LoaderBox, { setDocumentTitle, toTitleCase } from "../../lib/utils";
import classes from "./index.module.css";

type FilterTypes = "color" | "category" | "brand";

interface Filter {
  type: FilterTypes;
  value: string;
}

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [modalOpened, setModalOpened] = React.useState<boolean>(false);
  const [isFiltered, setIsFiltered] = useState(true);
  const isMobile = useMediaQuery("(max-width: 36em)");

  let user: {
    categories?: string[];
    searchQuery?: string;
  } | null = null;

  const location = useLocation();
  if (location.state) {
    user = location.state;
  }

  const setSortedProducts = (products: Product[]) => {
    setProducts(products.filter((p) => !p.tags.includes("out_of_stock")).concat(products.filter((p) => p.tags.includes("out_of_stock"))));
  };

  useEffect(() => {
    if (user?.searchQuery) {
      getProducts().then((products) => {
        setSortedProducts(
          products.filter((product) =>
            `${product.name}${product.custom_id && ` - ${product.custom_id}`}`.toLowerCase().includes(user!.searchQuery!.toLowerCase()),
          ),
        );
      });
      setIsLoaded(true);
    }
    if (user?.categories) {
      // fetch with first category
      getProducts().then((products) => {
        products = products.filter((product) => !!product.expand?.category);

        // filter products with other categories
        for (const category of user!.categories!) {
          products = products.filter((product) => product.expand!.category!.find((productCategory) => productCategory.name === category));
        }

        setFilters(
          user!.categories!.map((category) => ({
            type: "category",
            value: category,
          })),
        );

        setSortedProducts(products);
        setIsLoaded(true);
      });
    }
  }, [user]);

  const filterProducts = (newFilters: Filter[]) => {
    getProducts().then((products) => {
      for (const filter of newFilters) {
        switch (filter.type) {
          case "color":
            products = products.filter((product) => !!product.expand?.colors?.find((productColor) => productColor.name === filter.value));
            break;
          case "category":
            products = products.filter((product) => !!product.expand?.category?.find((productCategory) => productCategory.name === filter.value));
            break;
          case "brand":
            products = products.filter((product) => product.brand === filter.value);
            break;
        }
      }

      setSortedProducts(products);
      setIsFiltered(true);
    });
  };

  const updateFilters = (type: FilterTypes) => {
    return (values: string[]) => {
      const newFilters: Filter[] = [];
      for (const filter of filters) if (filter.type !== type) newFilters.push(filter);

      for (const value of values) newFilters.push({ type, value });

      setIsFiltered(false);
      setFilters(newFilters);
      filterProducts(newFilters);
    };
  };

  const getFilterValues = (type: FilterTypes) => filters.filter((filter) => filter.type === type).map((value) => value.value);

  useEffect(() => {
    setDocumentTitle("Catalog");

    if (!user)
      getProducts().then((products) => {
        setSortedProducts(products);
        setIsLoaded(true);
      });
  }, [user]);

  const [openCategoryFilter, categoryFilter] = useDisclosure(true);
  const [openBrandFilter, brandFilter] = useDisclosure(true);
  const [openColorFilter, colorFilter] = useDisclosure(true);

  function FilterNavBar() {
    return (
      <Box mih={"100%"} w={!isMobile ? 200 : "auto"} style={{ flex: "0.5" }}>
        <NavLink
          label="Categories"
          leftSection={<IconCategory size="1rem" stroke={1.5} />}
          childrenOffset={28}
          opened={openCategoryFilter}
          onClick={categoryFilter.toggle}
        >
          <Checkbox.Group value={getFilterValues("category")} onChange={updateFilters("category")}>
            <ScrollArea.Autosize mah={!isMobile ? 250 : "auto"}>
              {(() => {
                const categories: string[] = [];

                for (const product of products)
                  if (product.expand?.category)
                    for (const category of product.expand.category) if (!categories.includes(category.name)) categories.push(category.name);

                return categories.map((category) => <Checkbox mb={5} mt={5} label={category} value={category} key={category} />);
              })()}
            </ScrollArea.Autosize>
          </Checkbox.Group>
        </NavLink>
        <NavLink
          label="Brands"
          leftSection={<IconIcons size="1rem" stroke={1.5} />}
          childrenOffset={28}
          opened={openBrandFilter}
          onClick={brandFilter.toggle}
        >
          <Checkbox.Group value={getFilterValues("brand")} onChange={updateFilters("brand")}>
            <ScrollArea.Autosize mah={!isMobile ? 250 : "auto"}>
              {(() => {
                const brands: string[] = [];

                for (const product of products) if (!brands.includes(product.brand)) brands.push(product.brand);

                return brands.map((brand) => <Checkbox mb={5} mt={5} label={brand} value={brand} key={brand} />);
              })()}
            </ScrollArea.Autosize>
          </Checkbox.Group>
        </NavLink>
        <NavLink
          label="Colors"
          leftSection={<IconColorFilter size="1rem" stroke={1.5} />}
          childrenOffset={28}
          opened={openColorFilter}
          onClick={colorFilter.toggle}
        >
          <Checkbox.Group value={getFilterValues("color")} onChange={updateFilters("color")}>
            <ScrollArea.Autosize mah={!isMobile ? 250 : "auto"}>
              {(() => {
                const colors: string[] = [];

                for (const product of products)
                  if (product.expand?.colors) for (const color of product.expand.colors) if (!colors.includes(color.name)) colors.push(color.name);

                return colors.map((color) => <Checkbox mb={5} mt={5} label={toTitleCase(color)} value={color} key={color} />);
              })()}
            </ScrollArea.Autosize>
          </Checkbox.Group>
        </NavLink>
      </Box>
    );
  }

  if (!isLoaded) return <LoaderBox />;

  return (
    <Box className={classes.container}>
      <SmallChangeHelmet title="Catalog" description="Browse through our wide selection of products!" location="catalog" />
      <Modal
        opened={modalOpened}
        onClose={() => {
          setModalOpened(false);
        }}
        title={"Filters"}
        withCloseButton
      >
        <FilterNavBar />
      </Modal>
      <Box visibleFrom="xs">
        <FilterNavBar />
      </Box>
      <Box w="80%" display={"flex"} style={{ alignItems: "center", flexDirection: "column" }} mb="5%" hiddenFrom="xs">
        <Title order={1} mb="5%">
          Catalog
        </Title>
        <Button
          leftSection={<IconFilter size="1rem" stroke={1.5} />}
          variant="light"
          radius="xl"
          onClick={() => {
            setModalOpened(true);
          }}
        >
          Filters
        </Button>
      </Box>
      <Box style={{ flex: "4.5" }}>
        <Box ml="1vw" visibleFrom="xs">
          <Text mb="1vh" c="dimmed">
            Filters:
          </Text>
          <InputBase component="div" multiline>
            <Pill.Group>
              {filters.map((filter) => (
                <Pill
                  key={filter.value}
                  withRemoveButton
                  onRemove={() => {
                    const newFilters: Filter[] = [];
                    for (const f of filters) if (f.value !== filter.value) newFilters.push(f);
                    setFilters(newFilters);
                    filterProducts(newFilters);
                  }}
                >
                  {filter.value}
                </Pill>
              ))}
            </Pill.Group>
          </InputBase>
        </Box>
        {!isFiltered ? (
          <LoaderBox />
        ) : products.length === 0 ? (
          <Box display="flex" style={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }} w="100%" h="50vh">
            <IconSearchOff style={{ width: "30%", height: "30%", marginBottom: "1em" }} stroke={1} />
            <Title order={1} mb="md">
              No Products Found
            </Title>
            <Text>
              <UnstyledButton
                onClick={() => {
                  location.state = null;
                  user = null;
                  getProducts().then(setSortedProducts);
                  setFilters([]);
                }}
                style={{ color: "black", textDecoration: "underline" }}
              >
                Clear
              </UnstyledButton>{" "}
              filters/queries and try again.
            </Text>
          </Box>
        ) : (
          <Box className={classes.cardsBox}>
            {products
              .filter((p) => !p.hidden)
              .map((product) => (
                <ProductCard product={product} key={product.id} isMobile={isMobile} />
              ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
