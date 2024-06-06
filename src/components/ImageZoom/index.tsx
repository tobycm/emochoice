import { Avatar, Box, Flex, Image, Overlay, ScrollArea } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import pocketbase from "../../lib/database";
import { ProductImage } from "../../lib/database/models";

export default function ImageZoom({
  productImage,
  openBigImage,
  images = [],
  setProductImage,
  scrollHeight = 0,
}: {
  productImage: string;
  openBigImage: (open: boolean) => void;
  images?: ProductImage[];
  setProductImage: (image: string) => void;
  scrollHeight: number;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [needToClose, setNeedToClose] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // @ts-ignore
  const handleContentClick = (event) => {
    event.stopPropagation();
  };

  const handleScrollAreaFocus = () => {
    setIsFocused(true);
  };

  const handleScrollAreaBlur = () => {
    setIsFocused(false);
  };

  const handleClosingFocus = () => {
    setNeedToClose(true);
  };

  const handleClosingBlur = () => {
    setNeedToClose(false);
  };

  const isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        openBigImage(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  return (
    <Overlay
      onClick={() => {
        openBigImage(false);
      }}
      style={{ transform: `translateY(${scrollHeight}px` }}
    >
      <Flex h="100vh" direction="column" align="center" justify="flex-end" style={{ cursor: "pointer" }}>
        <Image
          style={{ height: "100vh", width: isFirefox ? "auto" : "min-content", cursor: "default" }}
          src={productImage}
          onClick={handleContentClick}
        />
        <Box
          w="100vw"
          h={120}
          style={{ position: "absolute", transform: "translateY(calc(-100vh + 120px))" }}
          onClick={handleContentClick}
          onMouseEnter={handleClosingFocus}
          onMouseLeave={handleClosingBlur}
        />
        <Avatar
          size={50}
          mr="auto"
          ml="auto"
          color="white"
          onMouseEnter={handleClosingFocus}
          onClick={() => {
            openBigImage(false);
          }}
          bg="#00000070"
          pos="absolute"
          style={{
            transform: needToClose ? "translateY(-92vh)" : "translateY(-100vh)",
            transition: "transform 0.3s ease",
          }}
        >
          <IconX size={30} />
        </Avatar>
        {images.length > 1 && (
          <ScrollArea
            w="60%"
            maw={800}
            p={15}
            pos="absolute"
            bg="#00000070"
            style={{
              borderRadius: "20px",
              cursor: "default",
              transform: "translateY(-15px)",
              transition: "opacity 0.3s ease",
            }}
            opacity={isFocused ? 1 : 0.3}
            onClick={handleContentClick}
            onMouseEnter={handleScrollAreaFocus}
            onMouseLeave={handleScrollAreaBlur}
          >
            <Flex>
              {images.map((image) => (
                <Image
                  key={image.id} // Add a unique key for each image in the array
                  src={pocketbase.getFileUrl(image, image.image)}
                  onClick={() => setProductImage(pocketbase.getFileUrl(image, image.image))}
                  h={80}
                  w="auto"
                  mr={10}
                  style={{ cursor: "pointer" }}
                />
              ))}
            </Flex>
          </ScrollArea>
        )}
      </Flex>
    </Overlay>
  );
}
