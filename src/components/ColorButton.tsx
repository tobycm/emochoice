import { Box } from "@mantine/core";

export default function ColorButton(props: { hex: string; texture: File | null; onClick: () => void }) {
  const { hex, texture, onClick } = props;

  return (
    <Box
      variant="filled"
      onClick={onClick}
      style={{
        margin: "2px",
        backgroundColor: hex,
        backgroundImage: texture ? `url(${URL.createObjectURL(texture)})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    ></Box>
  );
}
