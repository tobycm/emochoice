import "@mantine/carousel/styles.css";
import { MantineProvider } from "@mantine/core";
import { RouteObject, RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import Content from "./components/Content";
import { getProduct } from "./lib/database";
import { Product as DProduct } from "./lib/database/models"; // DProduct stands for Database Product
import Catalog from "./pages/Catalog";
import Contact from "./pages/Contact";
import Gallery from "./pages/Gallery";
import Home from "./pages/Home";
import List from "./pages/List";
import Product from "./pages/Product";

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
            return { product: await getProduct(params.id) };
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
                category: ["upfqqdkkgeff7wj"],
                colors: [],
                images: [],
                sizes: "11oz,15oz",
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
    ],
  },
];
const router = createBrowserRouter(routes);

router;

export default function App() {
  return (
    <MantineProvider
      theme={{
        primaryColor: "emochoice-yellow",
        colors: {
          "emochoice-yellow": ["#FCB918", "#FCB918", "#FCB918", "#FCB918", "#FCB918", "#FCB918", "#FCB918", "#FCB918", "#FCB918", "#FCB918"],
          "emochoice-green": ["#B1CB35", "#B1CB35", "#B1CB35", "#B1CB35", "#B1CB35", "#B1CB35", "#B1CB35", "#B1CB35", "#B1CB35", "#B1CB35"],
          "emochoice-blue": ["#0468B0", "#0468B0", "#0468B0", "#0468B0", "#0468B0", "#0468B0", "#0468B0", "#0468B0", "#0468B0", "#0468B0"],
        },
      }}
    >
      <RouterProvider router={router} />
    </MantineProvider>
  );
}
