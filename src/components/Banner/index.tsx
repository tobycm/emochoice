import { Image, Skeleton } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import pocketbase, { getGallery } from "../../lib/database";

export default function Banner() {
  const isMobile = useMediaQuery("(max-width: 48em)");
  const gallery = useQuery({ queryKey: ["home_carousel"], queryFn: async () => await getGallery("home_carousel") });

  const banners = useMemo(() => gallery.data?.pictures.map((link) => pocketbase.getFileUrl(gallery.data, link)) || [], [gallery.data]);

  const [currentBanner, setBanner] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setBanner((banner) => (banner + 1) % banners.length), 1250);

    return () => clearInterval(interval);
  }, [banners]);

  return (
    <Skeleton visible={gallery.isFetching} height={isMobile ? "20vh" : "30vh"} style={{ transform: "translate(0, -5vh)" }}>
      <Image src={banners[currentBanner]} h="100%" />
    </Skeleton>
  );
}
