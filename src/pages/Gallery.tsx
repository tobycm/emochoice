import { Box, Image } from "@mantine/core";
import { useEffect, useState } from "react";
import { getGallery } from "../lib/database";

export default function Gallery() {
  const [gallery, setGallery] = useState<string[]>([]);

  useEffect(() => {
    getGallery("tobycm").then((gallery) => setGallery(gallery));
  }, []);

  return (
    <Box>
      {gallery.map((link) => (
        <Image src={link} key={link} />
      ))}
    </Box>
  );
}
