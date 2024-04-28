import { useState, useEffect } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { router } from "../routes";
import { Outlet, Link } from "react-router-dom";
import "../styles/layout.css";
import { useMediaQuery } from "@mui/material";

const rootStyles = {
  backgroundColor: "#0048bd",
};

export default function Layout() {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const [collapsed, setCollapsed] = useState(isMobile);

  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  }, [isMobile]);

  const handleToggleSidebar = () => {
    setCollapsed(!collapsed);
  };
  return (
    <div style={{ display: "flex", height: "100%" }}>
      <Sidebar
        collapsed={collapsed}
        onToggle={handleToggleSidebar}
        className="sidebar"
        backgroundColor=""
        rootStyles={rootStyles}
      >
        <Menu>
          {router[0].children?.map((route) =>
            route.children && route.children?.length > 0 ? (
              <SubMenu
                key={route.id}
                icon={route.icon}
                label={route.id}
                className="custom-menu-item"
              >
                {route.children.map((subRoute) => (
                  <MenuItem
                    key={subRoute.id}
                    icon={subRoute.icon}
                    className="custom-menu-item"
                    component={<Link to={subRoute.path || "/admin/"} />}
                    rootStyles={rootStyles}
                    active={true}
                  >
                    {subRoute.id}
                  </MenuItem>
                ))}
              </SubMenu>
            ) : (
              <MenuItem
                key={route.id}
                icon={route.icon}
                className="custom-menu-item"
                component={<Link to={route.path || "/admin/"} />}
                active={true}
              >
                {route.id}
              </MenuItem>
            )
          )}
        </Menu>
      </Sidebar>

      <main className="container">
        <Outlet />
      </main>
    </div>
  );
}
