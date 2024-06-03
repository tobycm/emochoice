import { ActionIcon, Avatar, Box, Flex, Group, Image, Indicator, Popover, Text, Title } from "@mantine/core";
import { IconCheck, IconShoppingCart, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useATLState } from "../lib/atl_popover";
import pocketbase from "../lib/database";
import { Item, useList } from "../lib/list";
import { toTitleCase } from "../lib/utils";

export default function ListButton() {
  const ATL = useATLState();

  const [product, setProduct] = useState<Item | null>(null);
  const [productImage, setProductImage] = useState<string | null>(null);

  const [showList, setShowList] = useState(false);

  const { list } = useList();

  useEffect(() => {
    setShowList(list.length > 0);

    if (list.length == 0) return;

    const item = list[list.length - 1];
    setProduct(item);
    const selectedImage = item.color ? item.product.expand.images?.filter((image) => image.color == item.color?.id) ?? [] : [];
    if (selectedImage.length == 0)
      return setProductImage(pocketbase.getFileUrl(item.product.expand.images![0], item.product.expand.images![0].image) ?? "/images/no_image.png");
    setProductImage(pocketbase.getFileUrl(selectedImage[0], selectedImage[0].image));
  }, [list]);

  return (
    <Link to="/list">
      <Popover opened={ATL.current} withArrow arrowSize={15} radius={15}>
        <Popover.Target>
          {showList ? (
            <Indicator inline label={list.length} color="red" size={16}>
              <ActionIcon variant="red" radius="lg" size="lg">
                <IconShoppingCart style={{ width: "60%", height: "60%" }} stroke={3} />
              </ActionIcon>
            </Indicator>
          ) : (
            <ActionIcon variant="red" radius="lg" size="lg">
              <IconShoppingCart style={{ width: "60%", height: "60%" }} stroke={3} />
            </ActionIcon>
          )}
        </Popover.Target>
        <Popover.Dropdown>
          <Box>
            <Group justify="space-between" align="center" w="100%" mt="xs">
              <Flex justify="space-between" align="center">
                <Avatar variant="filled" radius="xl" size="sm" color="emochoice-green">
                  <IconCheck stroke={3} size="1.5rem" />
                </Avatar>
                <Title order={4} ml="sm">
                  Added to List!
                </Title>
              </Flex>
              <IconX onClick={() => ATL.set(false)} style={{ marginLeft: "auto", cursor: "pointer" }} />
            </Group>
            <Group justify="space-between" align="flex-start" w="max-content" mt="md">
              <Image src={productImage} w={100} />
              <Box>
                <Text fw={600} maw={200} lineClamp={2}>
                  {product?.product.name}
                  {product?.product.custom_id && ` - ${product?.product.custom_id}`}
                </Text>
                {product?.color && (
                  <Text c="grey" fz={15}>
                    Color: {toTitleCase(product?.color.name)}
                  </Text>
                )}
                {product?.type && (
                  <Text c="grey" fz={15}>
                    Type: {product?.type.name}
                  </Text>
                )}
                <Text c="grey" fz={15}>
                  Quantity: {product?.quantity}
                </Text>
              </Box>
            </Group>
          </Box>
        </Popover.Dropdown>
      </Popover>
    </Link>
  );
}
