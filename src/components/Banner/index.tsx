import { Box, Image } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";
import pocketbase, { getGallery } from "../../lib/database";

export default function Banner({ onLoad }: { onLoad?: () => void }) {
  const isMobile = useMediaQuery("(max-width: 48em)");
  const [banners, setBanners] = useState<string[]>([]);

  useEffect(() => {
    getGallery("home_carousel").then((gallery) => {
      setBanners(gallery.pictures.map((link) => pocketbase.getFileUrl(gallery, link)));

      if (onLoad) onLoad();

      setInterval(() => setBanners((banners) => banners.slice(1).concat(banners[0])), 1250);
    });
  }, []);

  return (
    <Box style={{ height: isMobile ? "20vh" : "30vh" }}>
      <Image src={banners[0]} h="100%" />
    </Box>
  );
}
