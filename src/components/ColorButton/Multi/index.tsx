import { Box, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { Color } from "../../../lib/database/models";
import { brightness as darkOrLight, toTitleCase } from "../../../lib/utils";

export default function MultiColorButton(props: { color: Color; onClick: () => void }) {
  const { color, onClick } = props;
  const [background, setBackground] = useState<string>("" as string);

  useEffect(() => {
    const linearProperties = () => {
      let percentages = new Array();
      const percentageOnePart = 100 / color.hex.split(",").length;
      for (let i = -1; i < color.hex.split(",").length; i++) {
        percentages.push(percentageOnePart * (i + 1));
      }
      let props = "";
      for (let i = 0; i < color.hex.split(",").length; i++) {
        props += `${color.hex.split(",")[i]} ${percentages[i]}%, ${color.hex.split(",")[i]} ${percentages[i + 1]}%, `;
      }
      return `linear-gradient(to bottom, ${props.slice(0, -2)})`;
    };

    setBackground(linearProperties());
  }, [color]);

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
        background: background,
        backgroundImage: color.texture ? `url(${color.texture})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: "5px",
      }}
    >
      <Text
        size="11px"
        pt={2}
        pl={2}
        lineClamp={3}
        style={{
          color: darkOrLight(color.hex.split(",")[0]) === "light" ? "#000000" : "#ffffff",
        }}
      >
        {toTitleCase(color.name)}
      </Text>
    </Box>
  );
}
