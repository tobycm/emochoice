import { Box, Button, Card, NumberInput, Pill, Table, Text, TextInput, Title, Tooltip } from "@mantine/core";
import { isEmail, isNotEmpty, useForm } from "@mantine/form";
import { useMediaQuery } from "@mantine/hooks";
import { IconLock } from "@tabler/icons-react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DefaultHelmet from "../../components/Helmets/DefaultHelmet";
import proceedList, { List as ListClass, useList } from "../../lib/list";
import { setDocumentTitle, toTitleCase } from "../../lib/utils";
import classes from "./index.module.css";

export default function Checkout() {
  const navigate = useNavigate();
  const { list, updateList } = useList();
  const isMobile = useMediaQuery(`(max-width: 36em)`);
  const form = useForm({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
    },
    validate: {
      firstName: isNotEmpty("Enter your first name"),
      lastName: isNotEmpty("Enter your last name"),
      email: isEmail("Invalid email"),
      address: isNotEmpty("Enter your address"),
      city: isNotEmpty("Enter your city"),
      state: isNotEmpty("Enter your state"),
      postalCode: isNotEmpty("Enter your postal code"),
    },
  });

  useEffect(() => {
    setDocumentTitle("Checkout");
    if (proceedList.length === 0) {
      navigate("/list", { replace: true });
    }
  }, []);

  return (
    <Box className={classes.outerBox}>
      <DefaultHelmet />
      <Title order={1} mb={20}>
        Checkout
      </Title>
      <Box w="100%">
        <Box
          component="form"
          className={classes.listAndCard}
          onSubmit={form.onSubmit(() => {
            const newList = new ListClass(
              ...list.filter((_, index) => {
                return !proceedList.includes(list[index]);
              }),
            );
            updateList(newList);
            navigate("/success", {
              replace: true,
              state: {
                order: proceedList,
                name: form.values.firstName + " " + form.values.lastName,
                email: form.values.email,
                address: form.values.address + ", " + form.values.city + ", " + form.values.state + " " + form.values.postalCode + ", Canada",
              },
            });
            setTimeout(() => {
              proceedList.length = 0;
            }, 200);
          })}
        >
          <Box className={classes.list}>
            <Table>
              <Table.Tbody>
                <Table.Tr>
                  <Table.Td visibleFrom="md">
                    <Title order={4}>1. Shipping Address</Title>
                  </Table.Td>
                  <Table.Td>
                    <Title order={4} mb="md" hiddenFrom="md">
                      1. Shipping Address
                    </Title>
                    <Box display="flex" style={{ justifyContent: "space-between" }} mb={"md"}>
                      <Box w="49%">
                        <TextInput withAsterisk label="First name" placeholder="John" {...form.getInputProps("firstName")} id="firstName" />
                      </Box>
                      <Box w="49%">
                        <TextInput withAsterisk label="Last name" placeholder="Smith" {...form.getInputProps("lastName")} id="lastName" />
                      </Box>
                    </Box>
                    <TextInput mb={"md"} withAsterisk label="Email" placeholder="johnsmith@email.com" {...form.getInputProps("email")} id="email" />
                    <TextInput mb={"md"} withAsterisk label="Country" value="Canada" disabled />
                    <TextInput
                      mb={"md"}
                      withAsterisk
                      label="Address Line"
                      id="address"
                      placeholder="Unit 101-737 Main St"
                      {...form.getInputProps("address")}
                    />
                    <Box display="flex" style={{ justifyContent: "space-between" }} mb={"md"}>
                      <Box w="49%">
                        <TextInput withAsterisk label="City" placeholder="Penticton" {...form.getInputProps("city")} id="city" />
                      </Box>
                      <Box w="20%">
                        <TextInput withAsterisk label="State" placeholder="BC" maxLength={2} {...form.getInputProps("state")} id="state" />
                      </Box>
                      <Box w="27%">
                        <TextInput withAsterisk label="Postal Code" placeholder="V2A 5E1" {...form.getInputProps("postalCode")} id="postalCode" />
                      </Box>
                    </Box>
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td visibleFrom="md">
                    <Title order={4}>2. Review Items and Shipping</Title>
                  </Table.Td>
                  <Table.Td>
                    <Title order={4} mb="md" mt="md" hiddenFrom="md">
                      2. Review Items and Shipping
                    </Title>
                    <Table verticalSpacing="md">
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th w={isMobile ? "80%" : "35%"}>Name</Table.Th>
                          {isMobile ? null : (
                            <>
                              <Table.Th w="10%">Color</Table.Th>
                              <Table.Th w="10%">Uploaded Image</Table.Th>
                              <Table.Th w="25%">Request</Table.Th>
                            </>
                          )}
                          <Table.Th w={isMobile ? "20%" : "15%"}>Quantity</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {proceedList.map((item, index) => (
                          <Table.Tr key={index}>
                            <Table.Td>{item.product.name}</Table.Td>
                            {isMobile ? null : (
                              <>
                                <Table.Td>
                                  {item.color ? (
                                    <>
                                      <Tooltip label={toTitleCase(item.color.name)}>
                                        <Box
                                          w={"2vh"}
                                          h={"2vh"}
                                          mr={5}
                                          style={{ backgroundColor: item.color.hex, border: "1px solid #777", borderRadius: "3px" }}
                                        ></Box>
                                      </Tooltip>
                                    </>
                                  ) : null}
                                </Table.Td>
                                <Table.Td maw={""}>{item.fileInput ? <Pill>{item.fileInput.name}</Pill> : null}</Table.Td>
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
                  </Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </Box>
          <Box className={classes.card}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Box w="100%" display="flex" style={{ justifyContent: "space-between", alignItems: "center" }} mb="md">
                <Title order={3}>Place your Order</Title>
                <IconLock></IconLock>
              </Box>
              <Text size="sm" c="dimmed">
                By clicking "Place Order" you agree to our{" "}
                <Link to="/terms-of-service" target="_blank" style={{ textDecoration: "none", color: "#0468B0" }}>
                  Terms of Service
                </Link>
                ,{" "}
                <Link to="/payment-policy" target="_blank" style={{ textDecoration: "none", color: "#0468B0" }}>
                  Payment Policy
                </Link>
                , and{" "}
                <Link to="/privacy-policy" target="_blank" style={{ textDecoration: "none", color: "#0468B0" }}>
                  Privacy Policy
                </Link>
                .
              </Text>
              <Button variant="light" color="emochoice-blue" fullWidth mt="md" radius="md" type="submit">
                Place Order
              </Button>
            </Card>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
