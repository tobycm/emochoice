import { NavLink } from "@mantine/core";
import { IconShirt } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { Tree } from "../../lib/utils";

export default function MobileDropdown({ closeDrawer, tree }: { closeDrawer: () => void; tree: Tree }) {
  console.log(tree);

  return (
    <NavLink label="All Products" leftSection={<IconShirt size="1rem" stroke={1.5} />} defaultOpened childrenOffset={28}>
      <Link to="/catalog" style={{ textDecoration: "none", color: "black" }} onClick={closeDrawer}>
        <NavLink label="Catalog" />
      </Link>
      <NavLink label="Clothing & Accessories Print" childrenOffset={28}>
        <NavLink label="T-Shirts" childrenOffset={28}>
          <NavLink label="Mens & Unisex" />
          <NavLink label="Womens" />
          <NavLink label="Youth" />
          <NavLink label="Infants & Toddlers" />
        </NavLink>
        <NavLink label="Sweatshirt & Fleece" />
        <NavLink label="Activewear" />
        <NavLink label="Hats" />
        <NavLink label="Bags" />
        <NavLink label="Others" />
      </NavLink>
      <NavLink label="Digital Printing" childrenOffset={28}>
        <NavLink label="Stickers" />
        <NavLink label="Banners" />
        <NavLink label="Brochures" />
      </NavLink>
      <NavLink label="Souvenirs & Gifts Printing" childrenOffset={28}>
        <NavLink label="Coffee Mugs" />
        <NavLink label="Photo Slates" />
        <NavLink label="Key Chain" />
        <NavLink label="Water Bottle" />
      </NavLink>
    </NavLink>
  );
}
