import { Box, Button, InputBase, Modal, Pill, Text, Title, UnstyledButton } from "@mantine/core";
import { IconFilter, IconSearchOff } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import ProductCard from "../../components/Card";
import FilterNavBar from "../../components/FilterNavBar";
import { getProducts } from "../../lib/database";
import { Product } from "../../lib/database/models";
import LoaderBox, { setDocumentTitle } from "../../lib/utils";
import classes from "./index.module.css";

type FilterTypes = "color" | "category" | "brand";

interface Filter {
  type: FilterTypes;
  value: string;
}

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [isFiltered, setIsFiltered] = useState<boolean>(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [modalOpened, setModalOpened] = React.useState<boolean>(false);

  let user: {
    categories?: string[];
    searchQuery?: string;
  } | null = null;

  const location = useLocation();
  if (location.state) {
    user = location.state;
  }

  const [filterNavBar, filterProducts] = FilterNavBar({
    onFiltered(products, filters) {
      setProducts(products);
      setFilters(filters);
      setIsFiltered(true);
    },
  });

  useEffect(() => {
    if (user?.searchQuery)
      getProducts().then((products) => {
        setProducts(
          products.filter((product) =>
            `${product.name}${product.custom_id && ` - ${product.custom_id}`}`.toLowerCase().includes(user!.searchQuery!.toLowerCase()),
          ),
        );
      });

    if (user?.categories)
      // fetch with first category
      getProducts().then((products) => {
        products = products.filter((product) => !!product.expand?.category);

        // filter products with other categories
        for (const category of user!.categories!) {
          products = products.filter((product) => product.expand!.category!.find((productCategory) => productCategory.name === category));
        }

        filterProducts(
          user!.categories!.map((category) => ({
            type: "category",
            value: category,
          })),
        );
        setIsFiltered(false);

        setProducts(products);
      });

    setIsLoaded(true);
  }, [user]);

  useEffect(() => {
    setDocumentTitle("Catalog");
  }, []);

  useEffect(() => {
    if (user) return;

    getProducts().then((products) => {
      setProducts(products);
      setIsLoaded(true);
    });
  }, [user]);

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
        {filterNavBar}
      </Modal>
      <Box visibleFrom="xs">{filterNavBar}</Box>
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
                    filterProducts(newFilters);
                    setIsFiltered(false);
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
                  getProducts().then(setProducts);
                  filterProducts([]);
                  setIsFiltered(false);
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
