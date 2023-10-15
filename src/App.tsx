import "@mantine/carousel/styles.css";
import { Box } from "@mantine/core";
import Header from "./components/Header";
import { Product } from "./pages/product";

export default function App() {
  return (
    <Box>
      <Header />
      <Product />
    </Box>
  );
}
