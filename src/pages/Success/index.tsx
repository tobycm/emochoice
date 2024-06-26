import { Avatar, Box, Flex, NumberInput, Pill, Table, Text, Title, Tooltip } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconCheck } from "@tabler/icons-react";
import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import DefaultHelmet from "../../components/Helmets/DefaultHelmet";
import { List } from "../../lib/list";
import { linearBackgroundProperties, setDocumentTitle, toTitleCase } from "../../lib/utils";

export default function Success() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 48em)");
  let user: { quote?: List; name?: string; contact?: string; address?: string } = {};

  const location = useLocation();
  if (location.state) {
    user = location.state as { quote: List; name: string; contact: string; address: string };
  }

  useEffect(() => {
    setDocumentTitle("Quote placed successfully");
    if (!user.address || !user.contact || !user.name || !user.quote) return navigate("/", { replace: true });
  });

  return (
    <Flex w="100%" mih="50vh" direction="column" align="center">
      <DefaultHelmet />
      {user.quote && user.name && user.contact && user.address && (
        <>
          <Flex w="90%" mt="xl" direction="column" align="center" justify="center" ta="center">
            <Avatar variant="filled" radius="xl" size="lg" color="emochoice-green" mb="md">
              <IconCheck stroke={3} size="2rem" />
            </Avatar>
            <Title ta="center" mb="md">
              You've Successfully Placed Your Quote!
            </Title>
            <Text mb="xl">
              We'll be in touch with you shortly to confirm your quote and to arrange payment. If you have any questions, please contact us{" "}
              <Link to="/contact" style={{ textDecoration: "none" }}>
                <Text component="span" td="underline" c="black">
                  here
                </Text>
              </Link>
              .
            </Text>
          </Flex>
          <Title ta="center" order={4} mt="xl" mb="md">
            Quote Details
          </Title>
          <Box w={isMobile ? "90%" : "70%"}>
            <Table verticalSpacing="md">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th w={isMobile ? "65%" : "30%"}>Name</Table.Th>
                  {isMobile ? null : (
                    <>
                      <Table.Th w="10%">Color</Table.Th>
                      <Table.Th w="10%">Type</Table.Th>
                      <Table.Th w="15%">Uploaded Image</Table.Th>
                      <Table.Th w="20%">Request</Table.Th>
                    </>
                  )}
                  <Table.Th w={isMobile ? "20%" : "15%"}>Quantity</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {user.quote.map((item, index) => (
                  <Table.Tr key={index}>
                    <Table.Td>
                      {item.product.name}
                      {item.product.custom_id && ` - ${item.product.custom_id}`}
                    </Table.Td>
                    {isMobile ? null : (
                      <>
                        <Table.Td>
                          {item.color && (
                            <>
                              <Tooltip label={toTitleCase(item.color.name)}>
                                <Box
                                  w="2vh"
                                  h="2vh"
                                  mr={5}
                                  style={{ background: linearBackgroundProperties(item.color), border: "1px solid #777", borderRadius: "3px" }}
                                ></Box>
                              </Tooltip>
                            </>
                          )}
                        </Table.Td>
                        <Table.Td maw="">{item.type?.name}</Table.Td>
                        <Table.Td maw="">{item.fileInput && <Pill>{item.fileInput.name}</Pill>}</Table.Td>
                        <Table.Td maw="" style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                          {item.request} {/* don't delete the blank maw */}
                        </Table.Td>
                      </>
                    )}
                    <Table.Td>
                      <NumberInput w="12%" miw={70} mr={10} hideControls disabled clampBehavior="strict" value={item.quantity} />
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Box>
          <Title ta="center" order={4} mt={"xl"} mb="md">
            Customer Information
          </Title>
          <Box w={isMobile ? "90%" : "70%"}>
            <Table verticalSpacing="md">
              <Table.Tbody>
                <Table.Tr>
                  <Table.Td fw="bold">Name</Table.Td>
                  <Table.Td>{user.name}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td fw="bold">Contact</Table.Td>
                  <Table.Td>{user.contact}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td fw="bold">Address</Table.Td>
                  <Table.Td>{user.address}</Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </Box>
        </>
      )}
    </Flex>
  );
}
