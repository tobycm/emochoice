import { Flex, Text, Title } from "@mantine/core";
import { IconShoppingCartQuestion } from "@tabler/icons-react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SmallChangeHelmet from "../../components/Helmets/SmallChangeHelmet";

export default function NotFound() {
  const navigate = useNavigate();
  useEffect(() => {
    const backToHome = setTimeout(() => navigate("/", { replace: true }), 3000);

    return () => clearTimeout(backToHome);
  });

  return (
    <Flex w="100%" h="50vh" direction="column" align="center" justify="center" ta="center">
      <SmallChangeHelmet title="Not Found" description="" location="" />
      <IconShoppingCartQuestion width="30%" height="30%" style={{ marginBottom: "1em" }} stroke={1} />
      <Title mb="md" ta="center">
        Oops, content not found!
      </Title>
      <Text ta="center">
        You will be automatically redirected to the{" "}
        <Link to="/" color="black">
          homepage
        </Link>{" "}
        shortly.
      </Text>
    </Flex>
  );
}
