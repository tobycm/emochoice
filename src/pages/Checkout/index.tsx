import { Box, Button, Card, Flex, NativeSelect, NumberInput, Pill, Table, Text, TextInput, Title, Tooltip } from "@mantine/core";
import { isEmail, isNotEmpty, useForm } from "@mantine/form";
import { useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconLock, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DefaultHelmet from "../../components/Helmets/DefaultHelmet";
import { List, useList } from "../../lib/list";
import { fileToBase64, formatPhoneNumber, linearBackgroundProperties, setDocumentTitle, toTitleCase } from "../../lib/utils";
import classes from "./index.module.css";

export default function Checkout() {
  const navigate = useNavigate();
  const { list, updateList } = useList();
  const [contactMethod, setContactMethod] = useState("Email & Phone number");
  const isMobile = useMediaQuery("(max-width: 48em)");
  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      phone_number: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      country: "Canada",
    },
    validate: {
      name: isNotEmpty("Enter your name"),
      email: contactMethod.includes("Email") ? isEmail("Enter a valid email") : undefined,
      phone_number: contactMethod.includes("Phone number") ? isNotEmpty("Enter a valid phone number") : undefined,
    },
  });

  useEffect(() => {
    setDocumentTitle("Checkout");
    if (list.length === 0) {
      navigate("/list", { replace: true });
    }
  }, []);

  return (
    <Box className={classes.outerBox}>
      <DefaultHelmet />
      <Title ta="center" order={1} mb={20}>
        Checkout
      </Title>
      <Box w="100%">
        <Box
          component="form"
          className={classes.listAndCard}
          onSubmit={form.onSubmit(async () => {
            const submitData = {
              name: form.values.name,
              contact: `${form.values.email}${form.values.email && form.values.phone_number && ", "}${form.values.phone_number}`,
              address: `${form.values.address}, ${form.values.city}, ${form.values.state} ${form.values.postalCode}, ${form.values.country}`,
              items: await Promise.all(
                list.map(async (item) => ({
                  id: item.product.id,
                  quantity: item.quantity,
                  color: item.color?.id ?? null,
                  type: item.type?.id ?? null,
                  image: item.fileInput ? await fileToBase64(item.fileInput) : null,
                  request: item.request ?? null,
                })),
              ),
            };
            try {
              const res = await fetch("https://api.emochoice.ca/quote", {
                method: "POST",
                body: JSON.stringify(submitData),
              });
              if (res.status !== 200) throw new Error("There was an error placing your quote. Please try again later.");
              const newList = new List(
                ...list.filter((_, index) => {
                  return !list.includes(list[index]);
                }),
              );
              updateList(newList);
              navigate("/success", {
                replace: true,
                state: {
                  quote: list,
                  name: submitData.name,
                  contact: submitData.contact,
                  address: submitData.address,
                },
              });
              setTimeout(() => {
                list.length = 0;
              }, 200);
            } catch (err) {
              notifications.show({
                title: "Error",
                message: (err as Error).message,
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
                    <Flex justify="space-between" mb="md">
                      <TextInput withAsterisk label="Name" placeholder="John Doe" w="100%" {...form.getInputProps("name")} />
                    </Flex>
                    <NativeSelect
                      required
                      withAsterisk
                      label="Contact Method"
                      mb="md"
                      value={contactMethod}
                      onChange={(e) => {
                        setContactMethod(e.currentTarget.value);
                        if (e.currentTarget.value === "Email") form.setFieldValue("phone_number", "");
                        if (e.currentTarget.value === "Phone number") form.setFieldValue("email", "");
                      }}
                      data={["Email", "Phone number", "Email & Phone number"]}
                    />
                    {contactMethod.includes("Email") && (
                      <TextInput mb={"md"} withAsterisk label="Email" placeholder="johnsmith@email.com" {...form.getInputProps("email")} id="email" />
                    )}
                    {contactMethod.includes("Phone number") && (
                      <TextInput
                        mb={"md"}
                        withAsterisk
                        label="Phone number"
                        placeholder="(123) 456-7890"
                        {...form.getInputProps("phone_number")}
                        id="phone_number"
                        maxLength={14}
                        onChange={(e) => {
                          if (e.currentTarget.value.length == 0) return form.setFieldValue("phone_number", "");
                          if (!/^[0-9() -]+$/.test(e.currentTarget.value)) return;
                          form.setFieldValue(
                            "phone_number",
                            e.currentTarget.value.length < form.values.phone_number.length
                              ? e.currentTarget.value
                              : formatPhoneNumber(e.currentTarget.value),
                          );
                        }}
                      />
                    )}
                    <NativeSelect mb={"md"} {...form.getInputProps("country")} id="country" label="Country" data={["Canada", "United States"]} />
                    <TextInput mb={"md"} label="Address Line" id="address" placeholder="Unit 101-737 Main St" {...form.getInputProps("address")} />
                    <Flex justify="space-between" mb="md">
                      <Box w="49%">
                        <TextInput label="City" placeholder="Penticton" {...form.getInputProps("city")} id="city" />
                      </Box>
                      <Box w="20%">
                        <TextInput label="State" placeholder="BC" maxLength={2} {...form.getInputProps("state")} id="state" />
                      </Box>
                      <Box w="27%">
                        <TextInput label="Postal Code" placeholder="V2A 5E1" {...form.getInputProps("postalCode")} id="postalCode" />
                      </Box>
                    </Flex>
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
                        {list.map((item, index) => (
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
                                          w={"2vh"}
                                          h={"2vh"}
                                          mr={5}
                                          style={{
                                            background: linearBackgroundProperties(item.color),
                                            border: "1px solid #777",
                                            borderRadius: "3px",
                                          }}
                                        ></Box>
                                      </Tooltip>
                                    </>
                                  )}
                                </Table.Td>
                                <Table.Td maw={""}>{item.type?.name}</Table.Td>
                                <Table.Td maw={""}>{item.fileInput && <Pill>{item.fileInput.name}</Pill>}</Table.Td>
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
              <Flex w="100%" justify="space-between" align="center" mb="md">
                <Title order={3}>Get a Quote</Title>
                <IconLock></IconLock>
              </Flex>
              <Text size="sm" c="dimmed">
                By clicking "Get a Quote" you agree to our{" "}
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
                Get a Quote
              </Button>
            </Card>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
