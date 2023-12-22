import { Box, Button, Checkbox, InputBase, Modal, NavLink, Pill, ScrollArea, Text, Title, UnstyledButton } from "@mantine/core";
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

  let user: {
    categories?: string[];
    searchQuery?: string;
  } | null = null;

  const location = useLocation();
  if (location.state) {
    user = location.state;
  }

  useEffect(() => {
    if (user?.searchQuery) {
      console.log(user?.searchQuery);
      getProducts().then((products) => {
        setProducts(products.filter((product) => product.name.toLowerCase().includes(user!.searchQuery!.toLowerCase())));
      });
      console.log(products);
    }
    if (user?.categories) {
      // fetch with first category
      getProducts().then((products) => {
        products = products.filter((product) => !!product.expand?.category);

        // filter products with other categories
        for (const category of user!.categories!) {
          products = products.filter((product) => {
            for (const productCategory of product.expand!.category!) return productCategory.name === category;
          });
        }

        setFilters(
          user!.categories!.map((category) => ({
            type: "category",
            value: category,
          })),
        );

        setProducts(products);
      });
    }
    setIsLoaded(true);
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

      setProducts(products);
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
        setProducts(products);
        setIsLoaded(true);
      });
  }, [user]);

  function FilterNavBar() {
    return (
      <Box mih={"100%"} miw={200} style={{ flex: "0.5" }}>
        <SmallChangeHelmet title="Catalog" description="Browse through our wide selection of products!" location="catalog" />
        <NavLink label="Categories" leftSection={<IconCategory size="1rem" stroke={1.5} />} childrenOffset={28} defaultOpened={false}>
          <Checkbox.Group value={getFilterValues("category")} onChange={updateFilters("category")}>
            <ScrollArea.Autosize mah={200}>
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
        <NavLink label="Brands" leftSection={<IconIcons size="1rem" stroke={1.5} />} childrenOffset={28} defaultOpened={false}>
          <Checkbox.Group value={getFilterValues("brand")} onChange={updateFilters("brand")}>
            <ScrollArea.Autosize mah={200}>
              {(() => {
                const brands: string[] = [];

                for (const product of products) if (!brands.includes(product.brand)) brands.push(product.brand);

                return brands.map((brand) => <Checkbox mb={5} mt={5} label={brand} value={brand} key={brand} />);
              })()}
            </ScrollArea.Autosize>
          </Checkbox.Group>
        </NavLink>
        <NavLink label="Colors" leftSection={<IconColorFilter size="1rem" stroke={1.5} />} childrenOffset={28} defaultOpened={false}>
          <Checkbox.Group value={getFilterValues("color")} onChange={updateFilters("color")}>
            <ScrollArea.Autosize mah={200}>
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
        <Title order={2} mb="5%">
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
            <Title order={2} mb="md">
              No Products Found
            </Title>
            <Text>
              <UnstyledButton
                onClick={() => {
                  location.state = null;
                  user = null;
                  getProducts().then(setProducts);
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
            {products.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
