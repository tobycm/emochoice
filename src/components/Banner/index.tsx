import { Box, Image } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { useEffect } from "preact/hooks";
import pocketbase, { getGallery } from "../../lib/database";

export default function Banner({ isMobile, onLoad }: { isMobile?: boolean; onLoad?: () => void }) {
  const [banners, bannersHandlers] = useListState<string>();

  useEffect(() => {
    getGallery("home_carousel").then((gallery) => {
      bannersHandlers.setState(gallery.pictures.map((link) => pocketbase.getFileUrl(gallery, link)));
      if (onLoad) onLoad();
    });
  }, []);

  useEffect(() => {
    setInterval(() => {
      bannersHandlers.setState((state) => {
        const newState = [...state];
        newState.push(newState.shift()!);
        return newState;
      });
    }, 1000);
  }, []);

  return (
    <Box style={{ height: isMobile ? "20vh" : "30vh" }}>
      <Image src={banners[0]} h="100%" />
    </Box>
  );
}
