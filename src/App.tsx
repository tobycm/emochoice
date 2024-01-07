import "@mantine/carousel/styles.css";
import { MantineProvider } from "@mantine/core";
import "@mantine/notifications/styles.css";
import { RouteObject, RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import Content from "./components/Content";
import { getProducts } from "./lib/database";
import { Product as DProduct } from "./lib/database/models"; // DProduct stands for Database Product
import NotFound from "./pages/404";
import Catalog from "./pages/Catalog";
import Checkout from "./pages/Checkout";
import Contact from "./pages/Contact";
import Document from "./pages/Document";
import Gallery from "./pages/Gallery";
import Home from "./pages/Home";
import List from "./pages/List";
import Product from "./pages/Product";
import Success from "./pages/Success";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Content />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/catalog",
        element: <Catalog />,
      },
      {
        path: "/product/:id",
        element: <Product />,
        loader: async ({ params }): Promise<{ product: DProduct }> => {
          try {
            if (!params.id) throw new Error("No product ID provided");
            const product = (await getProducts()).find((product) => product.id === params.id);
            if (!product) throw new Error("Product not found");
            return { product };
          } catch {
            return {
              product: {
                collectionId: "kt5o377go6qzzct",
                collectionName: "products",
                created: Date(),
                updated: Date(),
                brand: "Eggu no Toby",
                id: "messikimochi",
                name: "Sui-chan wa kyou mo Kawaii~ Mug",
                custom_id: "messikimochi",
                category: ["upfqqdkkgeff7wj"],
                hidden: false,
                tags: ["out_of_stock"],
                colors: [],
                types: [],
                images: [],
                boundary: "",
                description:
                  "Introducing the ultimate companion for your morning ritual - Sui-chan wa kyou mo Kawaii~ Mug. Elevate your coffee or tea experience with this exquisite, handcrafted vessel designed to cradle your favorite brew. Crafted from high-quality, lead-free ceramic, it ensures your beverage's purity and taste remain untarnished. The ergonomic handle provides a comfortable grip, while the wide base offers stability. Its double-walled insulation keeps drinks at the perfect temperature, whether piping hot or refreshingly cool. The elegant, minimalist design complements any kitchen or office space. Dishwasher and microwave safe, it's a breeze to clean and maintain. Indulge in your daily dose of comfort and style with this exceptional mug!",
                custom_data: null,
                expand: {
                  category: [
                    {
                      id: "upfqqdkkgeff7wj",
                      collectionId: "v7a6q7dmmdd4fb9",
                      collectionName: "categories",
                      created: Date(),
                      updated: Date(),
                      name: "Mug",
                    },
                  ],
                },
                customizable: false,
              },
            };
          }
        },
      },
      {
        path: "/list",
        element: <List />,
      },
      {
        path: "/gallery",
        element: <Gallery />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/checkout",
        element: <Checkout />,
      },
      {
        path: "/success",
        element: <Success />,
      },
      {
        path: "/terms-of-service",
        element: <Document id="wlcw2rf3wmllk38" />,
      },
      {
        path: "/payment-policy",
        element: <Document id="nzmhp5c2oh3l2nw" />,
      },
      {
        path: "/privacy-policy",
        element: <Document id="iyk0smsk7insnej" />,
      },
      {
        path: "/shipping-policy",
        element: <Document id="1wjibyy6pz48a5j" />,
      },
      {
        path: "/return-policy",
        element: <Document id="4wu5rjh81kiad7c" />,
      },
      {
        path: "/shopping-guide",
        element: <Document id="xq6msqjc7tqk62s" />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
];
const router = createBrowserRouter(routes);

export default function App() {
  return (
    <MantineProvider
      theme={{
        primaryColor: "emochoice-yellow",
        fontFamily: "Inter, sans-serif",
        headings: { fontFamily: "Inter, sans-serif" },
        colors: {
          "emochoice-yellow": ["#FCB918", "#FCB918", "#FCB918", "#FCB918", "#FCB918", "#FCB918", "#FCB918", "#FCB918", "#FCB918", "#FCB918"],
          "emochoice-green": ["#f8fce6", "#f0f5d5", "#e0ebaf", "#d0df84", "#c1d660", "#b8d049", "#b4cd3c", "#9db42c", "#8ba023", "#768b14"],
          "emochoice-blue": ["#0468B0", "#0468B0", "#0468B0", "#0468B0", "#0468B0", "#0468B0", "#0468B0", "#0468B0", "#0468B0", "#0468B0"],
        },
        breakpoints: {
          mn: "435px",
        },
      }}
    >
      <RouterProvider router={router} />
    </MantineProvider>
  );
}
