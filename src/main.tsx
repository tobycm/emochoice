// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";

import { render } from "preact";
import App from "./App";

render(<App />, document.getElementById("root")!);
