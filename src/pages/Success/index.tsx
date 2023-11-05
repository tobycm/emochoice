import { Avatar, Box, NumberInput, Pill, Table, Text, Title, Tooltip } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconCheck } from "@tabler/icons-react";
import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { List } from "../../lib/list";
import { setDocumentTitle } from "../../lib/utils";

export default function Success() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery(`(max-width: 36em)`);
  let user: { order?: List; name?: string; email?: string; address?: string } = {};
  if (useLocation().state) {
    user = useLocation().state as { order: List; name: string; email: string; address: string };
  }

  useEffect(() => {
    setDocumentTitle("Order Success");
    console.log(user);
    if (!user.order || !user.name || !user.email || !user.address) {
      navigate("/", { replace: true });
      return;
    }
  });

  return (
    <Box w="100%" mih="50vh" display="flex" style={{ flexDirection: "column", alignItems: "center" }}>
      {user.order && user.name && user.email && user.address ? (
        <>
          <Box
            w="90%"
            mt="xl"
            display="flex"
            style={{ flexDirection: "column", textAlign: "center", justifyContent: "center", alignItems: "center" }}
          >
            <Avatar variant="filled" radius="xl" size="lg" color="emochoice-green" mb="md">
              <IconCheck stroke={3} size="2rem" />
            </Avatar>
            <Title mb={"md"}>You've Successfully Placed Your Order!</Title>
            <Text mb="xl">
              We'll be in touch with you shortly to confirm your order and to arrange payment. If you have any questions, please contact us{" "}
              <Link to="/contact" style={{ textDecoration: "none" }}>
                <Text component="span" style={{ textDecoration: "underline", color: "black" }}>
                  here
                </Text>
              </Link>
              .
            </Text>
          </Box>
          <Title order={4} mt={"xl"} mb="md">
            Order Details
          </Title>
          <Box w={isMobile ? "90%" : "70%"}>
            <Table verticalSpacing="md">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th w={isMobile ? "80%" : "35%"}>Name</Table.Th>
                  {isMobile ? null : (
                    <>
                      <Table.Th w="10%">Color</Table.Th>
                      <Table.Th w="10%">Size</Table.Th>
                      <Table.Th w="10%">Uploaded Image</Table.Th>
                      <Table.Th w="25%">Request</Table.Th>
                    </>
                  )}
                  <Table.Th w={isMobile ? "20%" : "15%"}>Quantity</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {user.order.map((item, index) => (
                  <Table.Tr key={index}>
                    <Table.Td>{item.product.name}</Table.Td>
                    {isMobile ? null : (
                      <>
                        <Table.Td>
                          {item.color ? (
                            <>
                              <Tooltip label={item.color.name}>
                                <Box w={"2vh"} h={"2vh"} mr={5} style={{ backgroundColor: item.color.hex, border: "1px solid grey" }}></Box>
                              </Tooltip>
                            </>
                          ) : null}
                        </Table.Td>
                        <Table.Td>{item.size}</Table.Td>
                        <Table.Td maw={""}>{!!item.fileInput ? <Pill>{item.fileInput.name}</Pill> : null}</Table.Td>
                        <Table.Td maw={""} style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                          {item.request} {/* don't delete the blank maw */}
                        </Table.Td>
                      </>
                    )}
                    <Table.Td>
                      <NumberInput w={"12%"} miw={70} mr={10} hideControls disabled clampBehavior="strict" value={item.quantity} />
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Box>
          <Title order={4} mt={"xl"} mb="md">
            Customer Information
          </Title>
          <Box w={isMobile ? "90%" : "70%"}>
            <Table verticalSpacing="md">
              <Table.Tbody>
                <Table.Tr>
                  <Table.Td fw={"bold"}>Name</Table.Td>
                  <Table.Td>{user.name}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td fw={"bold"}>Email</Table.Td>
                  <Table.Td>{user.email}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td fw={"bold"}>Address</Table.Td>
                  <Table.Td>{user.address}</Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </Box>
        </>
      ) : null}
    </Box>
  );
}