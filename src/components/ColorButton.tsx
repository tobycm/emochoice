import { Box } from "@mantine/core";

export default function ColorButton(props: { hex: string; texture: string; onClick: () => void }) {
  const { hex, texture, onClick } = props;

  return (
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
  );
}
