import { ActionIcon, Autocomplete, Box } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ProductWithKeywords, searchProducts } from "../lib/utils/search";

export default function SearchBar({ products }: { products: ProductWithKeywords[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);

  const [colors, setColors] = useState<string[]>([]);

  useEffect(() => {
    if (!products) return;

    const colors: string[] = [];

    products.forEach((product) => product.expand.colors?.forEach((color) => colors.includes(color.name) && colors.push(color.name)));

    setColors(colors);
  }, [products]);

  const isMobile = useMediaQuery("(max-width: 48em)");
  const navigate = useNavigate();

  function search(search: string = searchQuery) {
    search = search.trim();

    const url = new URL(window.location.href);

    url.searchParams.set("search", search);

    navigate("/catalog" + url.search);
  }

  useEffect(() => {
    setSearchResults(searchProducts(products, searchQuery, colors));
  }, [searchQuery, products, colors]);

  return (
    <Box w={isMobile ? "85%" : 400} display={"flex"} style={{ justifyContent: "space-between" }}>
      <Autocomplete
        radius="xl"
        w={"100%"}
        mr={10}
        placeholder="Model ID, brand, category, color, types, etc..."
        data={searchResults}
        filter={() => searchResults.map((result) => ({ value: result, label: result }))}
        onKeyDown={(e) => {
          if (!(e.key == "Enter")) return;
          search();
          (e.currentTarget as HTMLInputElement).blur();
        }}
        onOptionSubmit={search}
        onChange={setSearchQuery}
        limit={10}
      />

      <ActionIcon variant="filled" radius="lg" size="lg" mr={10} onClick={() => search()}>
        <IconSearch style={{ width: "60%", height: "60%" }} stroke={3} />
      </ActionIcon>
    </Box>
  );
}
