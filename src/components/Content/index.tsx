import { Notifications } from "@mantine/notifications";
import { HelmetProvider } from "react-helmet-async";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { ListProvider } from "../../lib/list";
import Footer from "../Footer";
import Header from "../Header";

export default function Content() {
  const helmetContext = {};
  return (
    <ListProvider>
      <HelmetProvider context={helmetContext}>
        <Notifications limit={5} />
        <ScrollRestoration />
        <Header />
        <Outlet />
        <Footer />
      </HelmetProvider>
    </ListProvider>
  );
}
