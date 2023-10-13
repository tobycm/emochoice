// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";

import { MantineProvider } from "@mantine/core";
import App from "./App";

export default function main() {
  return (
    <MantineProvider>
      <App />
    </MantineProvider>
  );
}
