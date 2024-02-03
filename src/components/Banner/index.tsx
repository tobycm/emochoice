import { Box, Image } from "@mantine/core";
import { useEffect } from "preact/hooks";

export default function Banner({ isMobile, onLoad }: { isMobile?: boolean; onLoad?: () => void }) {
  useEffect(() => {
    // @ts-ignore when fetch has priority
    fetch("/images/hex-banner.png", { priority: "high" }).then(() => onLoad && onLoad());
  }, [onLoad]);

  return (
    <Box style={{ height: isMobile ? "20vh" : "30vh" }}>
      <Image src="/images/hex-banner.png" h="100%" />
    </Box>
  );
}
