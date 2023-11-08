import { Notifications } from "@mantine/notifications";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { ListProvider } from "../../lib/list";
import Footer from "../Footer";
import Header from "../Header";

export default function Content() {
  return (
    <ListProvider>
      <Notifications limit={5} />
      <ScrollRestoration />
      <Header />
      <Outlet />
      <Footer />
    </ListProvider>
  );
}
