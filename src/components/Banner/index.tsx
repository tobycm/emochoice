import { Box, Image } from "@mantine/core";
import { useEffect, useState } from "preact/hooks";
import pocketbase, { getGallery } from "../../lib/database";

export default function Banner({ isMobile, onLoad }: { isMobile?: boolean; onLoad?: () => void }) {
  const [banners, setBanners] = useState<string[]>([]);

  useEffect(() => {
    getGallery("home_carousel").then((gallery) => {
      setBanners(gallery.pictures.map((link) => pocketbase.getFileUrl(gallery, link)));
      if (onLoad) onLoad();
    });
  }, []);

  useEffect(() => {
    setInterval(() => {
      setBanners((state) => {
        const newState = [...state];
        newState.push(newState.shift()!);
        return newState;
      });
    }, 2500);
  }, []);

  return (
    <Box style={{ height: isMobile ? "20vh" : "30vh" }}>
      <Image src={banners[0]} h="100%" />
    </Box>
  );
}
