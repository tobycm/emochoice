import "@mantine/carousel/styles.css";
import { MantineProvider } from "@mantine/core";
import { RouteObject, RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import Content from "./components/Content";
import Contact from "./pages/Contact";
import Gallery from "./pages/Gallery";
import Product from "./pages/Product";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Content />,
    children: [
      {
        path: "/",
        element: <Product />,
      },
      {
        path: "/gallery",
        element: <Gallery />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
    ],
  },
];
const router = createBrowserRouter(routes);

export default function App() {
  return (
    <MantineProvider>
      <RouterProvider router={router} />
    </MantineProvider>
  );
}
