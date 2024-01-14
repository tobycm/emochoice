import { Box, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { Color } from "../../../lib/database/models";
import { darkOrLight, linearProperties, toTitleCase } from "../../../lib/utils";

export default function MultiColorButton({ color, onClick }: { color: Color; onClick: () => void }) {
  const [background, setBackground] = useState("");

  useEffect(() => setBackground(linearProperties(color)), [color]);

  return (
    <Box
      variant="filled"
      onClick={onClick}
      mr={4}
      mb={4}
      h={40}
      w={60}
      style={{
        cursor: "pointer",
        border: "1px solid #777",
        background,
        backgroundImage: color.texture && `url(${color.texture})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: "5px",
      }}
    >
      <Text size="11px" pt={2} pl={2} lineClamp={3} style={{ color: darkOrLight(color.hex.split(",")[0]) === "light" ? "#000000" : "#ffffff" }}>
        {toTitleCase(color.name)}
      </Text>
    </Box>
  );
}
