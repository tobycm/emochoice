import { Outlet } from "react-router-dom";
import Footer from "../Footer";
import Header from "../Header";

export default function Content() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}
