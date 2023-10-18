import "@mantine/carousel/styles.css";
import { MantineProvider } from "@mantine/core";
import { RouteObject, RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import Content from "./components/Content";
import { getCategory, getProduct } from "./lib/database";
import { Product as DProduct } from "./lib/database/models"; // DProduct stands for Database Product
import Catalog from "./pages/Catalog";
import Contact from "./pages/Contact";
import Gallery from "./pages/Gallery";
import Home from "./pages/Home";
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
        loader: async ({ params }): Promise<{ product: DProduct; category: string[] }> => {
          try {
            if (!params.id) throw new Error("No product ID provided");
            const product = await getProduct(params.id);

            const category: string[] = [];
            for (const categoryId of product.category) category.push((await getCategory(categoryId)).name);

            return { product, category };
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
                description:
                  "Introducing the ultimate companion for your morning ritual - Sui-chan wa kyou mo Kawaii~ Mug. Elevate your coffee or tea experience with this exquisite, handcrafted vessel designed to cradle your favorite brew. Crafted from high-quality, lead-free ceramic, it ensures your beverage's purity and taste remain untarnished. The ergonomic handle provides a comfortable grip, while the wide base offers stability. Its double-walled insulation keeps drinks at the perfect temperature, whether piping hot or refreshingly cool. The elegant, minimalist design complements any kitchen or office space. Dishwasher and microwave safe, it's a breeze to clean and maintain. Indulge in your daily dose of comfort and style with this exceptional mug!",
                custom_data: {
                  size: ["11oz", "15oz"],
                  "Material Type": "Ceramic",
                },
              },
              category: ["Mugs"],
            };
          }
        },
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
    <MantineProvider>
      <RouterProvider router={router} />
    </MantineProvider>
  );
}
