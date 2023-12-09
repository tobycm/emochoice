import { Box, Text, Tooltip } from "@mantine/core";
import { Color } from "../lib/database/models";
import { brightness as darkOrLight, toTitleCase } from "../lib/utils";

export default function ColorButton(props: { color: Color; onClick: () => void }) {
  const { color, onClick } = props;

  return (
    <Tooltip label={toTitleCase(color.name)} openDelay={200}>
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
          style={{
            color: darkOrLight(color.hex) === "light" ? "#000000" : "#ffffff",
          }}
        >
          {color.name}
        </Text>
      </Box>
    </Tooltip>
  );
}
