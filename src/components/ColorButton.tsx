import { Box, Tooltip } from "@mantine/core";
import { toTitleCase } from "../lib/utils";

export default function ColorButton(props: { hex: string; texture: string; onClick: () => void; name: string }) {
  const { hex, texture, onClick } = props;

  return (
    <Tooltip label={toTitleCase(props.name)} openDelay={200}>
      <Box
        variant="filled"
        onClick={onClick}
        mr={6}
        mb={6}
        mih={30}
        miw={50}
        style={{
          cursor: "pointer",
          border: "1px solid #777",
          backgroundColor: hex,
          backgroundImage: texture ? `url(${texture})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: "5px",
        }}
      ></Box>
    </Tooltip>
  );
}
