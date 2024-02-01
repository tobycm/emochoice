import { Box, Image } from "@mantine/core";

import classes from "./index.module.css";

export default function Banner() {
  return (
    <Box>
      <Image className={classes.hexagon} src={"https://avatars.githubusercontent.com/u/62174797"} />
    </Box>
  );
}
