import { Box, Image } from "@mantine/core";

export default function Banner({ isMobile }: { isMobile?: boolean }) {
  return (
    <Box style={{ height: isMobile ? "20vh" : "30vh" }}>
      <Image src="/images/hex-banner.png" h="100%" />
    </Box>
  );
}
