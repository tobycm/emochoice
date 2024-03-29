import { Box, Text } from "@mantine/core";
import { Color } from "../../../lib/database/models";
import { darkOrLight, toTitleCase } from "../../../lib/utils";

export default function SingleColorButton(props: { color: Color; onClick: () => void }) {
  const { color, onClick } = props;

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
        backgroundColor: color.hex,
        backgroundImage: color.texture ? `url(${color.texture})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: "5px",
      }}
    >
      <Text
        size="11px"
        pr={2}
        pt={2}
        pl={2}
        lineClamp={3}
        style={{
          color: darkOrLight(color.hex) === "light" ? "#000000" : "#ffffff",
        }}
      >
        {toTitleCase(color.name)}
      </Text>
    </Box>
  );
}
