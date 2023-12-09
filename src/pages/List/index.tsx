import { Box, Button, Card, Checkbox, NumberInput, Pill, Table, Text, Title, Tooltip, UnstyledButton } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconShoppingCartSearch, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DefaultHelmet from "../../components/Helmets/DefaultHelmet";
import proceedList, { Item, List as ListClass, useList } from "../../lib/list";
import LoaderBox, { setDocumentTitle, toTitleCase } from "../../lib/utils";
import classes from "./index.module.css";

export default function List() {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const { list, updateList } = useList();
  const [deletedList, setDeletedList] = useState<Item[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setDocumentTitle("My List");
    setIsDataLoaded(true);
  }, []);

  const isMobile = useMediaQuery(`(max-width: 36em)`);

  return (
    <Box className={classes.outerBox}>
      <DefaultHelmet />
      <Title order={2} mb={20}>
        My List
      </Title>
      {deletedList.length > 0 ? (
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
      ) : null}
      {isDataLoaded ? (
        list && list.length > 0 ? (
          <Box w="100%">
            <Box className={classes.listAndCard}>
              <Box className={classes.list}>
                <Table verticalSpacing="md" highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th w="5%"></Table.Th>
                      <Table.Th w={isMobile ? "75%" : "30%"}>Name</Table.Th>
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
                    {list.map((item, index) => (
                      <Table.Tr key={index}>
                        <Table.Td>
                          <Checkbox defaultChecked id={`checkbox${index}`} />
                        </Table.Td>
                        <Table.Td>
                          <Link
                            to={`/product/${item.product.id}`}
                            style={{ textDecoration: "none", color: "black" }}
                            state={{
                              color: item.color,
                              request: item.request,
                              quantity: item.quantity,
                              fileInput: item.fileInput,
                            }}
                          >
                            {item.product.name}
                          </Link>
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
                          <Box display="flex" style={{ alignItems: "center" }}>
                            <NumberInput w={"12%"} miw={70} mr={10} clampBehavior="strict" min={1} max={99} defaultValue={item.quantity} />
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
                      proceedList.length = 0;
                      list.forEach((item, index) => {
                        const checkbox = document.getElementById(`checkbox${index}`) as HTMLInputElement;
                        if (checkbox.checked) {
                          proceedList.push(item);
                        }
                      });

                      navigate("/checkout");
                    }}
                  >
                    Proceed to Checkout
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
