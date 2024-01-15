import { Box, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { Color } from "../../../lib/database/models";
import { linearBackgroundProperties, linearTextColorProperties, toTitleCase } from "../../../lib/utils";

export default function MultiColorButton({ color, onClick }: { color: Color; onClick: () => void }) {
  const [background, setBackground] = useState("");

  useEffect(() => setBackground(linearBackgroundProperties(color)), [color]);

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
      <Text
        size="11px"
        h="38px"
        pr={2}
        pt={2}
        pl={2}
        lineClamp={3}
        style={{
          background: linearTextColorProperties(color),
          WebkitBackgroundClip: "text",
          color: "transparent",
          display: "inline-block",
        }}
      >
        {toTitleCase(color.name).replace("/", " / ")}
      </Text>
    </Box>
  );
}
