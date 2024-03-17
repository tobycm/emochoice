import { Box, Button, Card, Checkbox, NumberInput, Pill, Table, Text, Title, Tooltip, UnstyledButton } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconShoppingCartExclamation, IconShoppingCartSearch, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DefaultHelmet from "../../components/Helmets/DefaultHelmet";
import { getProducts } from "../../lib/database";
import { Item, List as ListClass, useList } from "../../lib/list";
import LoaderBox, { linearBackgroundProperties, setDocumentTitle, toTitleCase } from "../../lib/utils";
import classes from "./index.module.css";

export default function List() {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const { list, updateList } = useList();
  const [deletedList, setDeletedList] = useState<Item[]>([]);
  const navigate = useNavigate();

  const changeHiddenStatus = async () => {
    const newList = new ListClass(...list);
    const newProducts = await getProducts();
    await Promise.all(
      newList.map(async (item) => {
        item.product = newProducts.find((product) => product.id === item.product.id) as Item["product"];
      }),
    );
    updateList(
      newList
        .filter((item) => !item.product.hidden && !item.product.tags.includes("out_of_stock"))
        .concat(newList.filter((item) => !item.product.hidden && item.product.tags.includes("out_of_stock")))
        .concat(newList.filter((item) => item.product.hidden)) as ListClass,
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      setDocumentTitle("My List");
      await changeHiddenStatus();
      setIsDataLoaded(true);
    };

    fetchData();
  }, []);

  const isMobile = useMediaQuery("(max-width: 48em)");

  return (
    <Box className={classes.outerBox}>
      <DefaultHelmet />
      <Title ta="center" order={1} mb={20}>
        My List
      </Title>
      {deletedList.length > 0 && (
        <Box mb={20} style={{ textAlign: "center", fontWeight: "600" }} c={"emochoice-blue"}>
          {deletedList.length} item{`${deletedList.length != 1 ? "s" : ""}`} removed from list.{" "}
          <Link
            style={{ color: "#0468B0" }}
            to="/list"
            onClick={() => {
              const newList = new ListClass(...list.concat(deletedList));
              updateList(newList);
              setDeletedList([]);
            }}
          >
            Restore all
          </Link>
        </Box>
      )}
      {isDataLoaded ? (
        list && list.length > 0 ? (
          <Box w="100%">
            <Box className={classes.listAndCard}>
              <Box className={classes.list}>
                <Table verticalSpacing="md" highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th w="5%"></Table.Th>
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
                      <Table.Tr
                        key={index}
                        style={{ backgroundColor: item.product.hidden || item.product.tags.includes("out_of_stock") ? "#EBEBEB" : "" }}
                      >
                        <Table.Td>
                          <Checkbox
                            defaultChecked={!(item.product.hidden || item.product.tags.includes("out_of_stock"))}
                            id={`checkbox${index}`}
                            style={{ pointerEvents: item.product.hidden || item.product.tags.includes("out_of_stock") ? "none" : "auto" }}
                          />
                        </Table.Td>
                        <Table.Td>
                          <Link
                            to={`/product/${item.product.id}`}
                            style={{ textDecoration: "none", color: "black", pointerEvents: item.product.hidden ? "none" : "auto" }}
                            state={{
                              color: item.color,
                              request: item.request,
                              quantity: item.quantity,
                              fileInput: item.fileInput,
                            }}
                          >
                            {item.product.name}
                            {item.product.custom_id && ` - ${item.product.custom_id}`}
                          </Link>
                          {(item.product.hidden || item.product.tags.includes("out_of_stock")) && (
                            <Text fw={600} style={{ fontSize: "15px" }} c="red">
                              This product is currently {item.product.hidden ? "unavailable" : "out of stock"}.
                            </Text>
                          )}
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
                                      style={{ background: linearBackgroundProperties(item.color), border: "1px solid #777", borderRadius: "3px" }}
                                    ></Box>
                                  </Tooltip>
                                </>
                              )}
                            </Table.Td>
                            <Table.Td maw={""}>{item.type?.name}</Table.Td>
                            <Table.Td maw={""}>{item.fileInput && <Pill>{item.fileInput.name}</Pill>}</Table.Td>
                            <Table.Td maw={""} style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                              {item.request}
                            </Table.Td>
                          </>
                        )}
                        <Table.Td>
                          <Box display="flex" style={{ alignItems: "center" }}>
                            <NumberInput
                              w={"12%"}
                              miw={70}
                              mr={10}
                              style={{ pointerEvents: item.product.hidden || item.product.tags.includes("out_of_stock") ? "none" : "auto" }}
                              clampBehavior="strict"
                              min={1}
                              max={99}
                              defaultValue={item.quantity}
                            />
                            <UnstyledButton
                              style={{ display: "flex", alignItems: "center" }}
                              onClick={() => {
                                setDeletedList([...deletedList, item]);
                                const newList = new ListClass(...list.filter((_, i) => i !== index));
                                updateList(newList);
                              }}
                            >
                              <IconX style={{ color: "red" }} stroke={1.5}></IconX>
                            </UnstyledButton>
                          </Box>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Box>
              <Box className={classes.card}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Title order={3} mb={"0.5em"}>
                    Checkout
                  </Title>
                  <Text size="sm" c="dimmed">
                    Price is going to be discussed with the seller later via email/phone call.
                  </Text>
                  <Button
                    variant="light"
                    color="emochoice-blue"
                    fullWidth
                    mt="md"
                    radius="md"
                    type="submit"
                    onClick={() => {
                      // list.length = 0; // huh why did i do this???
                      list.forEach((item, index) => {
                        const checkbox = document.getElementById(`checkbox${index}`) as HTMLInputElement;
                        if (checkbox.checked) updateList(new ListClass(...list, item));
                      });
                      list.length > 0
                        ? navigate("/checkout")
                        : notifications.show({
                            title: "No items selected",
                            message: "Please select at least one item to proceed",
                            color: "red",
                            icon: <IconShoppingCartExclamation stroke={2} />,
                            autoClose: 5000,
                            withCloseButton: true,
                          });
                    }}
                  >
                    Get a Quote
                  </Button>
                </Card>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <IconShoppingCartSearch style={{ width: "30%", height: "30%", marginBottom: "1em" }} stroke={1} />
            <Text>
              Nothing here yet.{" "}
              {
                <Link to="/catalog" style={{ color: "black" }}>
                  Browse
                </Link>
              }{" "}
              and start adding items to the list!
            </Text>
          </Box>
        )
      ) : (
        <LoaderBox />
      )}
    </Box>
  );
}
