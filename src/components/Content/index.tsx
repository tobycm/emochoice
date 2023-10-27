import { Outlet, ScrollRestoration } from "react-router-dom";
import { ListProvider } from "../../lib/list";
import Footer from "../Footer";
import Header from "../Header";

export default function Content() {
  return (
    <ListProvider>
      <ScrollRestoration />
      <Header />
      <Outlet />
      <Footer />
    </ListProvider>
  );
}
