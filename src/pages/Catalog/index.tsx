// new catalog

import { Box, Button, InputBase, Modal, Pill, Text, Title, UnstyledButton } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { IconFilter, IconSearchOff } from "@tabler/icons-react";
import { useEffect, useState } from "preact/hooks";
import { useNavigate } from "react-router";
import ProductCard from "../../components/Card";
import FilterNavBar from "../../components/Filters/NavBar";
import { Filter, filterProducts, getFilters, outOfStockToEnd } from "../../components/Filters/utils";
import { getProducts } from "../../lib/database";
import { Product } from "../../lib/database/models";
import LoaderBox, { setDocumentTitle } from "../../lib/utils";
import classes from "./index.module.css";

export default function Catalog() {
  const [isLoaded, setIsLoaded] = useState(false);
  const isMobile = useMediaQuery("(max-width: 36em)");
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filters, setFilters] = useState<Filter[]>([]);

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setDocumentTitle("Catalog");

    const url = new URL(window.location.href);

    const searchQuery = url.searchParams.get("search")?.toLowerCase();
    if (searchQuery) setSearchQuery(searchQuery);

    const filtersId = url.searchParams.get("filters")?.split("+");
    if (filtersId) getFilters(filtersId).then(setFilters);
  }, []);

  useEffect(() => {
    filterProducts(filters).then((products) => {
      if (searchQuery) products = products.filter((product) => product.name.toLowerCase().includes(searchQuery));

      products = outOfStockToEnd(products);
      !isLoaded && setIsLoaded(true);

      setProducts(products);
    });
  }, [searchQuery, filters]);

  useEffect(() => {
    if (!filters.length) navigate("/catalog");
    else {
      const url = new URL(window.location.href);
      const newFilters = filters.map((filter) => filter.value.id).join("+");
      if (url.searchParams.get("filters") !== newFilters) {
        url.searchParams.set("filters", newFilters);

        navigate(url.pathname + url.search);
      }
    }
  }, [filters]);

  const [filterModalOpened, filterModalControls] = useDisclosure(false);

  if (!isLoaded)
    return (
      <Box>
        <LoaderBox />
      </Box>
    );

  return (
    <Box>
      <Box className={classes.container}>
        <Modal opened={filterModalOpened} onClose={filterModalControls.close} title={"Filters"} withCloseButton>
          <FilterNavBar setFilters={setFilters} filters={filters} />
        </Modal>
        <Box visibleFrom="xs">
          <FilterNavBar setFilters={setFilters} filters={filters} />
        </Box>
        <Box w="80%" display={"flex"} style={{ alignItems: "center", flexDirection: "column" }} mb="5%" hiddenFrom="xs">
          <Title ta="center" order={1} mb="5%">
            Catalog
          </Title>
          <Button leftSection={<IconFilter size="1rem" stroke={1.5} />} variant="light" radius="xl" onClick={filterModalControls.open}>
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
                  <Pill key={filter.value.id} withRemoveButton onRemove={() => setFilters(filters.filter((f) => f.value.id !== filter.value.id))}>
                    {filter.value.name}
                  </Pill>
                ))}
              </Pill.Group>
            </InputBase>
          </Box>
          {products.length === 0 ? (
            <Box display="flex" style={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }} w="100%" h="50vh">
              <IconSearchOff style={{ width: "30%", height: "30%", marginBottom: "1em" }} stroke={1} />
              <Title ta="center" order={1} mb="md">
                No Products Found
              </Title>
              <Text>
                <UnstyledButton
                  onClick={() => {
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
              {products
                .filter((product) => !product.hidden)
                .map((product) => (
                  <ProductCard product={product} key={product.id} isMobile={isMobile} />
                ))}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
