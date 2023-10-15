// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";

import { MantineProvider } from "@mantine/core";
import { StrictMode } from "react";
import {
  RouteObject,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

import ReactDOM from "react-dom/client";
import App from "./App";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
  },
];
const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider>
      <RouterProvider router={router} />
    </MantineProvider>
  </StrictMode>
);
