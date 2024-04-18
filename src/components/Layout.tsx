import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { router } from "../routes";
import { Link } from "react-router-dom";
import "../styles/layout.css";

export default function Layout() {
  return (
    <div style={{ display: "flex", height: "100%" }}>
      <Sidebar className="sidebar" backgroundColor="">
        <Menu className="custom-sidebar">
          {router[0].children.map(
            ({ id, path }) =>
              path && (
                <MenuItem
                  className="custom-menu-item"
                  component={<Link to={path} />}
                >
                  {id}
                </MenuItem>
              )
          )}
        </Menu>
      </Sidebar>
    </div>
  );
}
