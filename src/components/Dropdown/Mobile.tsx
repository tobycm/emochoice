import { NavLink } from "@mantine/core";
import { IconLayoutGrid, IconShirt, IconTags } from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";
import { Tree, isNotEmptyObject } from "../../lib/utils";

export default function MobileDropdown({ closeDrawer, tree }: { closeDrawer: () => void; tree: Tree }) {
  const navigate = useNavigate();

  return (
    <NavLink label="All Products" leftSection={<IconShirt size="1rem" stroke={1.5} />} defaultOpened childrenOffset={28}>
      <Link to="/catalog" style={{ textDecoration: "none", color: "black" }} onClick={closeDrawer}>
        <NavLink label="Catalog" leftSection={<IconLayoutGrid size="1rem" stroke={1.5} />} />
      </Link>
      {Object.keys(tree).map((key) => (
        <NavLink label={key} childrenOffset={28}>
          <NavLink
            leftSection={<IconTags size="1rem" stroke={1.5} />}
            label={"Explore all"}
            onClick={() => {
              navigate("/catalog", { state: { categories: [key] } });
              closeDrawer();
            }}
          />
          {Object.keys(tree[key]).map((key2) => {
            const subTree = (tree[key] as Record<string, string>)[key2];
            return isNotEmptyObject(subTree) ? (
              <NavLink label={key2} childrenOffset={28}>
                {Object.keys(subTree).map((key3) => (
                  <NavLink
                    label={key3}
                    onClick={() => {
                      navigate("/catalog", { state: { categories: [key, key2, key3] } });
                      closeDrawer();
                    }}
                  />
                ))}
              </NavLink>
            ) : (
              <NavLink
                label={key2}
                onClick={() => {
                  navigate("/catalog", { state: { categories: [key, key2] } });
                  closeDrawer();
                }}
              />
            );
          })}
        </NavLink>
      ))}
    </NavLink>
  );
}
