import { Box, Text } from "@mantine/core";
import { Color } from "../lib/database/models";
import { brightness as darkOrLight, toTitleCase } from "../lib/utils";

export default function ColorButton(props: { color: Color; onClick: () => void }) {
  const { color, onClick } = props;

  return (
    <Box
      variant="filled"
      onClick={onClick}
      mr={6}
      mb={6}
      mih={35}
      miw={60}
      mah={35}
      maw={60}
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
        p={2}
        style={{
          color: darkOrLight(color.hex) === "light" ? "#000000" : "#ffffff",
        }}
      >
        {toTitleCase(color.name)}
      </Text>
    </Box>
  );
}
