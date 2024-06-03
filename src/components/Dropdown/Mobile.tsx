import { NavLink } from "@mantine/core";
import { IconLayoutGrid, IconShirt, IconTags } from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";
import { ProductCategory } from "../../lib/database/models";
import { Tree } from "../../lib/utils";

export default function MobileDropdown({ closeDrawer, tree, fetching }: { closeDrawer: () => void; tree: Tree; fetching: boolean }) {
  const navigate = useNavigate();

  /**
   * @param categories IDs of categories to go to
   */
  function goToCatalog(categories?: ProductCategory[]) {
    return () => {
      navigate(`/catalog${categories?.length ? `?filters=category:${categories.map((cate) => cate.id).join("+")}` : ""}`);
      closeDrawer();
    };
  }

  return (
    <NavLink label="All Products" leftSection={<IconShirt size="1rem" stroke={1.5} />} defaultOpened childrenOffset={28}>
      <Link to="/catalog" style={{ textDecoration: "none", color: "black" }} onClick={closeDrawer}>
        <NavLink label="Catalog" leftSection={<IconLayoutGrid size="1rem" stroke={1.5} />} />
      </Link>
      {fetching ? (
        <NavLink label="Loading..." />
      ) : (
        Array.from(tree.entries()).map(([cate, subTree]) => (
          <NavLink key={cate.id} label={cate.name} childrenOffset={28}>
            <NavLink leftSection={<IconTags size="1rem" stroke={1.5} />} label={"Explore all"} onClick={goToCatalog([cate])} />
            {Array.from(subTree.entries()).map(([cate2, subTree]) =>
              !subTree.size ? (
                <NavLink key={cate2.id} label={cate2.name} onClick={goToCatalog([cate, cate2])} />
              ) : (
                <NavLink key={cate2.id} label={cate2.name} childrenOffset={28}>
                  {
                    // do recursion function next time to make infinite subcategories :grin:
                  }
                  {Array.from(subTree.entries()).map(([cate3]) => (
                    <NavLink key={cate3.id} label={cate3.name} onClick={goToCatalog([cate, cate2, cate3])} />
                  ))}
                </NavLink>
              ),
            )}
          </NavLink>
        ))
      )}
    </NavLink>
  );
}
