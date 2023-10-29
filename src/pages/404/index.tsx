import { Box, Text, Title } from "@mantine/core";
import { IconShoppingCartQuestion } from "@tabler/icons-react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      navigate("/", { replace: true });
    }, 3000);
  });

  return (
    <Box w="100%" h="50vh" display="flex" style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
      <IconShoppingCartQuestion style={{ width: "30%", height: "30%", marginBottom: "1em" }} stroke={1} />
      <Title mb={"md"}>Oops, content not found!</Title>
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
