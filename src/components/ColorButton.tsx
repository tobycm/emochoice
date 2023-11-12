import { Box, Tooltip } from "@mantine/core";
import { toTitleCase } from "../lib/utils";

export default function ColorButton(props: { hex: string; texture: string; onClick: () => void; name: string }) {
  const { hex, texture, onClick } = props;

  return (
    <Tooltip label={toTitleCase(props.name)} openDelay={200}>
      <Box
        variant="filled"
        onClick={onClick}
        m={2}
        mih={30}
        miw={50}
        style={{
          border: "1px solid black",
          backgroundColor: hex,
          backgroundImage: texture ? `url(${texture})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></Box>
    </Tooltip>
  );
}
