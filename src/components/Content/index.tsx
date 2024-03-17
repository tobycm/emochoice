import { Notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { HelmetProvider } from "react-helmet-async";
import { Outlet } from "react-router";
import { ScrollRestoration } from "react-router-dom";
import { ATLStateProvider } from "../../lib/atl_popover";
import Constants from "../../lib/constants";
import { ListProvider } from "../../lib/list";
import Maintenance from "../../pages/Maintenance";
import Footer from "../Footer";
import Header from "../Header";

export default function Content() {
  const [page, setPage] = useState(
    <ListProvider>
      <ATLStateProvider>
        <HelmetProvider>
          <Notifications limit={5} />
          <ScrollRestoration />
          <Header />
          <Outlet />
          <Footer />
        </HelmetProvider>
      </ATLStateProvider>
    </ListProvider>,
  );

  useEffect(() => {
    fetch(`${Constants.PocketBaseURL}/api`)
      .then((res) => {
        if (res.status !== 200) setPage(<Maintenance />);
      })
      .catch(() => {
        setPage(<Maintenance />);
      });
  }, []);

  return page;
}
