import { useState, useEffect } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { router } from "../routes";
import { Outlet, Link } from "react-router-dom";
import "../styles/layout.css";
import {
  useMediaQuery,
  AppBar,
  Toolbar,
  IconButton,
  Menu as MuiMenu,
  MenuItem as MuiMenuItem,
  Avatar,
  Box,
  CssBaseline,
} from "@mui/material";
import smallLogo from "../assets/small.png";

const rootStyles = {
  backgroundColor: "#009B85",
};

export default function Layout() {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const [collapsed, setCollapsed] = useState(isMobile);
  const [anchorEl, setAnchorEl] = useState(null);

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

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Lógica para cerrar sesión
    console.log("Logout");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <CssBaseline />
      <AppBar position="static" sx={{ backgroundColor: "#009B85" }}>
        <Toolbar>
          <Box display="flex" flexGrow={1}>
            <Link to="/">
              <img
                src={smallLogo}
                alt="Company Logo"
                style={{
                  height: 40,
                  width: 40,
                  borderRadius: "20%",
                  backgroundColor: "white",
                  padding: 0.1,
                }}
              />
            </Link>
          </Box>
          <IconButton
            edge="end"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
          >
            <Avatar alt="User Icon" src="user-icon.png" />
          </IconButton>
          <MuiMenu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MuiMenuItem onClick={handleLogout}>Cerrar sesión</MuiMenuItem>
          </MuiMenu>
        </Toolbar>
      </AppBar>

      <div style={{ display: "flex", flex: 1 }}>
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

        <main className="container" style={{ flex: 1, overflow: "auto" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
