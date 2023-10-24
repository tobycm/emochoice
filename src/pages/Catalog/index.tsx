import { Box, Checkbox, CheckboxGroup, InputBase, Loader, NavLink, Pill, Text } from "@mantine/core";
import { IconCategory, IconColorFilter, IconIcons, IconShirt } from "@tabler/icons-react";
import { ListResult } from "pocketbase";
import { useEffect, useState } from "react";
import ProductCard from "../../components/Card";
import { getProducts } from "../../lib/database";
import { Product } from "../../lib/database/models";
import { setDocumentTitle } from "../../lib/utils";
import classes from "./index.module.css";

export default function Catalog() {
  const [products, setProducts] = useState<ListResult<Product>>();
  const [isLoaded, setIsLoaded] = useState(false);
  const [filters, setFilters] = useState<string[]>([]);

  useEffect(() => {
    setDocumentTitle("Catalog");
    getProducts().then((products) => {
      setProducts(products);
      setIsLoaded(true);
    });
  }, []);

  return (
    <Box className={classes.container}>
      <Box mih={"100%"} miw={200} style={{ flex: "0.5" }} visibleFrom="xs">
        <NavLink label="Category" leftSection={<IconCategory size="1rem" stroke={1.5} />} childrenOffset={28} defaultOpened>
          <CheckboxGroup value={filters} onChange={setFilters}>
            <Checkbox mb={5} mt={5} label="Hats" value="Hats" />
            <Checkbox mb={5} mt={5} label="Jackets" value="Jackets" />
            <Checkbox mb={5} mt={5} label="Onesies" value="Onesies" />
            <Checkbox mb={5} mt={5} label="Shorts" value="Shorts" />
            <Checkbox mb={5} mt={5} label="T-Shirts" value="T-Shirts" />
            <Checkbox mb={5} mt={5} label="Pants" value="Pants" />
          </CheckboxGroup>
        </NavLink>
        <NavLink label="Fit" leftSection={<IconShirt size="1rem" stroke={1.5} />} childrenOffset={28} defaultOpened>
          <CheckboxGroup value={filters} onChange={setFilters}>
            <Checkbox mb={5} mt={5} label="Infants / Toddlers" value="Infants / Toddlers" />
            <Checkbox mb={5} mt={5} label="Mens & Unisex" value="Mens & Unisex" />
            <Checkbox mb={5} mt={5} label="Womens" value="Womens" />
            <Checkbox mb={5} mt={5} label="Youth" value="Youth" />
            <Checkbox mb={5} mt={5} label="Adjustable" value="Adjustable" />
            <Checkbox mb={5} mt={5} label="Fitted" value="Fitted" />
          </CheckboxGroup>
        </NavLink>
        <NavLink label="Brand" leftSection={<IconIcons size="1rem" stroke={1.5} />} childrenOffset={28} defaultOpened>
          <CheckboxGroup value={filters} onChange={setFilters}>
            <Checkbox mb={5} mt={5} label="Toby Cm's Lab" value="Toby Cm's Lab" />
            <Checkbox mb={5} mt={5} label="Emochoice" value="Emochoice" />
            <Checkbox mb={5} mt={5} label="Hoshino Ai" value="Hoshino Ai" />
            <Checkbox mb={5} mt={5} label="Boiz Gang" value="Boiz Gang" />
          </CheckboxGroup>
        </NavLink>
        <NavLink label="Colour" leftSection={<IconColorFilter size="1rem" stroke={1.5} />} childrenOffset={28} defaultOpened>
          <CheckboxGroup value={filters} onChange={setFilters}>
            <Checkbox mb={5} mt={5} label="Red" value="Red" />
            <Checkbox mb={5} mt={5} label="Orange" value="Orange" />
            <Checkbox mb={5} mt={5} label="Yellow" value="Yellow" />
            <Checkbox mb={5} mt={5} label="Green" value="Green" />
            <Checkbox mb={5} mt={5} label="Blue" value="Blue" />
            <Checkbox mb={5} mt={5} label="Indigo" value="Indigo" />
            <Checkbox mb={5} mt={5} label="Violet" value="Violet" />
          </CheckboxGroup>
        </NavLink>
      </Box>
      {isLoaded ? (
        <Box style={{ flex: "4.5" }}>
          <Box ml="1vw" visibleFrom="xs">
            <Text mb="1vh" c="dimmed">
              Filters:
            </Text>
            <InputBase component="div" multiline>
              <Pill.Group>
                {filters.map((filter) => (
                  <Pill
                    key={filter}
                    withRemoveButton
                    onRemove={() => {
                      setFilters(filters.filter((f) => f !== filter));
                    }}
                  >
                    {filter}
                  </Pill>
                ))}
              </Pill.Group>
            </InputBase>
          </Box>
          <Box className={classes.cardsBox}>
            {products?.items.map((product) => {
              return <ProductCard product={product} />;
            })}
          </Box>
        </Box>
      ) : (
        <Box display="flex" style={{ justifyContent: "center", alignItems: "center" }} w="80%">
          <Loader size="xl" />
        </Box>
      )}
    </Box>
  );
}
