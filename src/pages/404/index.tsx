import { Box, Title, Text } from "@mantine/core";
import { IconShoppingCartQuestion } from "@tabler/icons-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  useEffect(() => {
    setTimeout(() => {
      window.location.href = "/";
    }, 3000);
  });

  return (
    <Box w="100%" h="50vh" display="flex" style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
      <IconShoppingCartQuestion style={{ width: "30%", height: "30%", marginBottom: "1em" }} stroke={1} />
      <Title mb={"1em"}>Oops, content not found!</Title>
      <Text>
        You will be automatically redirected to the{" "}
        {
          <Link to="/" style={{ color: "black" }}>
            homepage
          </Link>
        }{" "}
        shortly.
      </Text>
    </Box>
  );
}
