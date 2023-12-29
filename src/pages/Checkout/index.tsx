import { Box, Button, Card, NativeSelect, NumberInput, Pill, Table, Text, TextInput, Title, Tooltip } from "@mantine/core";
import { isEmail, isNotEmpty, useForm } from "@mantine/form";
import { useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconLock, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DefaultHelmet from "../../components/Helmets/DefaultHelmet";
import proceedList, { List as ListClass, useList } from "../../lib/list";
import { setDocumentTitle, toTitleCase } from "../../lib/utils";
import classes from "./index.module.css";

export default function Checkout() {
  const navigate = useNavigate();
  const { list, updateList } = useList();
  const [contactMethod, setContactMethod] = useState("Email");
  const isMobile = useMediaQuery(`(max-width: 36em)`);
  const form = useForm({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone_number: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      country: "Canada",
    },
    validate: {
      firstName: isNotEmpty("Enter your first name"),
      lastName: isNotEmpty("Enter your last name"),
      email: contactMethod.includes("Email") ? isEmail("Enter a valid email") : undefined,
      phone_number: contactMethod.includes("Phone number") ? isNotEmpty("Enter a valid phone number") : undefined,
      address: isNotEmpty("Enter your address"),
      city: isNotEmpty("Enter your city"),
      state: isNotEmpty("Enter your state"),
      postalCode: isNotEmpty("Enter your postal code"),
      country: isNotEmpty("Enter your country"),
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
          onSubmit={form.onSubmit(async () => {
            let submitData = {
              name: `${form.values.firstName} ${form.values.lastName}`,
              contact: `${form.values.email}${form.values.email && form.values.phone_number && ", "}${form.values.phone_number}`,
              address: `${form.values.address}, ${form.values.city}, ${form.values.state} ${form.values.postalCode}, ${form.values.country}`,
              items: proceedList.map((item) => {
                return {
                  id: item.product.id,
                  quantity: item.quantity,
                  color: item.color ? item.color.id : null,
                  image: item.fileInput ? item.fileInput : null,
                  request: item.request ? item.request : null,
                };
              }),
            };
            try {
              const formData = new FormData();
              formData.append("name", submitData.name);
              formData.append("contact", submitData.contact);
              formData.append("address", submitData.address);
              submitData.items.forEach((item, index) => {});
              await fetch("https://df6t9npp-3000.usw2.devtunnels.ms/quote", {
                method: "POST",
                body: formData,
              }).then((res) => {
                if (res.status !== 200) throw new Error("There was an error placing your order. Please try again later.");
              });
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
                  name: submitData.name,
                  contact: submitData.contact,
                  address: submitData.address,
                },
              });
              setTimeout(() => {
                proceedList.length = 0;
              }, 200);
            } catch (err: any) {
              notifications.show({
                title: "Error",
                message: err.message,
                color: "red",
                icon: <IconX stroke={2} />,
                autoClose: 10000,
                withCloseButton: true,
              });
            }
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
                    <NativeSelect
                      required
                      withAsterisk
                      label="Contact Method"
                      mb="md"
                      value={contactMethod}
                      onChange={(event) => {
                        setContactMethod(event.currentTarget.value);
                        if (event.currentTarget.value === "Email") form.setFieldValue("phone_number", "");
                        if (event.currentTarget.value === "Phone number") form.setFieldValue("email", "");
                      }}
                      data={["Email", "Phone number", "Email & Phone number"]}
                    />
                    {contactMethod.includes("Email") ? (
                      <TextInput mb={"md"} withAsterisk label="Email" placeholder="johnsmith@email.com" {...form.getInputProps("email")} id="email" />
                    ) : null}
                    {contactMethod.includes("Phone number") ? (
                      <TextInput
                        mb={"md"}
                        withAsterisk
                        minLength={10}
                        maxLength={10}
                        label="Phone number"
                        placeholder="1234567890"
                        {...form.getInputProps("phone_number")}
                        id="phone_number"
                      />
                    ) : null}
                    <NativeSelect
                      mb={"md"}
                      {...form.getInputProps("country")}
                      id="country"
                      withAsterisk
                      label="Country"
                      data={["Canada", "United States"]}
                    />
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
                            <Table.Td>
                              {item.product.name}
                              {item.product.custom_id && ` - ${item.product.custom_id}`}
                            </Table.Td>
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
