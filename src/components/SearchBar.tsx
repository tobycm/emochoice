import { ActionIcon, Autocomplete, Flex } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { getProducts } from "../lib/database";
import { searchProducts } from "../lib/utils/search";

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  // const [searchResults, setSearchResults] = useState<string[]>([]);

  const products = useQuery({ queryKey: ["products"], queryFn: getProducts });

  const colors: string[] = useMemo(() => {
    const colors: string[] = [];

    products.data?.forEach((product) => product.expand.colors?.forEach((color) => colors.includes(color.name) && colors.push(color.name)));

    return colors;
  }, [products.data]);

  const searchResults = useMemo(() => searchProducts(products.data || [], searchQuery, colors), [products.data, searchQuery, colors]);

  const isMobile = useMediaQuery("(max-width: 48em)");
  const navigate = useNavigate();

  function search(search: string = searchQuery) {
    search = search.trim();

    const url = new URL(window.location.href);

    url.searchParams.set("search", search);

    navigate("/catalog" + url.search);
  }

  return (
    <Flex w={isMobile ? "85%" : 400} justify="space-between">
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
    </Flex>
  );
}
