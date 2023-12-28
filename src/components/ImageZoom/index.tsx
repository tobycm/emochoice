import React, { useState } from "react";

import { Avatar, Box, Image, Overlay, ScrollArea } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { useEffect } from "react";
import pocketbase from "../../lib/database";
import { Product } from "../../lib/database/models";

export default function ImageZoom(props: {
  productImage: string;
  openBigImage: (open: boolean) => void;
  images: string[];
  setProductImage: (image: string) => void;
  product: Product;
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

  const handleContentClick = (event: React.MouseEvent) => {
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
        props.openBigImage(false);
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
        props.openBigImage(false);
      }}
      style={{ transform: `translateY(${props.scrollHeight}px` }}
    >
      <Box
        h="100vh"
        display={"flex"}
        style={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
          cursor: "pointer",
        }}
      >
        <Image
          style={{ height: "100vh", width: isFirefox ? "auto" : "min-content", cursor: "default" }}
          src={props.productImage}
          onClick={handleContentClick}
        />
        <Box
          w="100vw"
          h={120}
          style={{ position: "absolute", transform: "translateY(calc(-100vh + 120px))" }}
          onClick={handleContentClick}
          onMouseEnter={handleClosingFocus}
          onMouseLeave={handleClosingBlur}
        ></Box>
        <Avatar
          size={50}
          mr="auto"
          ml="auto"
          color="white"
          onMouseEnter={handleClosingFocus}
          onClick={() => {
            props.openBigImage(false);
          }}
          style={{
            backgroundColor: "#00000070",
            position: "absolute",
            transform: needToClose ? "translateY(-92vh)" : "translateY(-100vh)",
            transition: "transform 0.3s ease",
          }}
        >
          <IconX size={30} />
        </Avatar>
        {props.images.length > 1 ? (
          <ScrollArea
            w="60%"
            maw={800}
            p={15}
            style={{
              backgroundColor: "#00000070",
              borderRadius: "20px",
              cursor: "default",
              position: "absolute",
              transform: "translateY(-15px)",
              transition: "opacity 0.3s ease",
            }}
            opacity={isFocused ? 1 : 0.3}
            onClick={handleContentClick}
            onMouseEnter={handleScrollAreaFocus}
            onMouseLeave={handleScrollAreaBlur}
          >
            <Box display={"flex"}>
              {props.images.map((image) => (
                <Image
                  key={image} // Add a unique key for each image in the array
                  src={pocketbase.getFileUrl(props.product, image)}
                  onClick={() => props.setProductImage(pocketbase.getFileUrl(props.product, image))}
                  style={{
                    height: "80px",
                    width: "auto",
                    marginRight: "10px",
                    cursor: "pointer",
                  }}
                />
              ))}
            </Box>
          </ScrollArea>
        ) : null}
      </Box>
    </Overlay>
  );
}

ImageZoom.defaultProps = {
  images: [],
  product: {},
};
