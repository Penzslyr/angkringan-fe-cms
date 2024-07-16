import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Toolbar,
  Box,
  ListItemButton,
  Avatar,
  useTheme,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import RateReviewIcon from "@mui/icons-material/RateReview";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import HistoryIcon from "@mui/icons-material/History";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../App.css";
import { useAuth } from "../middleware/AuthProvider";

const SideNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const theme = useTheme();

  const getItemStyle = (path) => {
    return location.pathname === path
      ? {
          backgroundColor: "rgba(0, 0, 0, 0.08)",
          color: theme.palette.primary.main,
        }
      : {};
  };

  const getItemIconStyle = (path) => {
    return location.pathname === path
      ? { color: theme.palette.primary.main }
      : {};
  };

  const handleLogOut = () => {
    logout();
    navigate("/");
  };

  const adminNavItems = [
    { text: "Manage Customer", icon: <GroupIcon />, path: "/ManageCustomers" },
    { text: "Manage Menu", icon: <MenuBookIcon />, path: "/ManageMenu" },
    { text: "Manage Stocks", icon: <MenuBookIcon />, path: "/ManageStocks" },
    {
      text: "Manage Transactions",
      icon: <MonetizationOnIcon />,
      path: "/ManageTransactions",
    },
  ];

  const managerNavItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/Dashboard" },
    { text: "Manage User", icon: <GroupIcon />, path: "/ManageUser" },
    { text: "Manage Menu", icon: <MenuBookIcon />, path: "/ManageMenu" },
    { text: "Manage Stocks", icon: <MenuBookIcon />, path: "/ManageStocks" },
    { text: "Manage Promo", icon: <LocalOfferIcon />, path: "/ManagePromo" },
    { text: "Manage Review", icon: <RateReviewIcon />, path: "/ManageReview" },
    {
      text: "Manage Transactions",
      icon: <MonetizationOnIcon />,
      path: "/ManageTransactions",
    },
    { text: "Logs", icon: <HistoryIcon />, path: "/Logs" },
  ];

  const sideNavItems = user.isAdmin ? adminNavItems : managerNavItems;

  return (
    <Drawer variant="permanent" className="drawer">
      <Toolbar className="toolbar">
        <Typography
          sx={{ color: "primary.main", textTransform: "uppercase" }}
          variant="h6"
          noWrap
        >
          Bonsuwong CMS
        </Typography>
      </Toolbar>
      <Box className="sideNavBox">
        <List className="sideNavList">
          {sideNavItems.map((item, index) => (
            <ListItem
              button
              key={index}
              component={Link}
              to={item.path}
              className="sideNavItem"
              style={getItemStyle(item.path)}
            >
              <ListItemIcon
                className="sideNavIcon"
                style={getItemIconStyle(item.path)}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
        <List style={{ position: "absolute", bottom: "0", width: "100%" }}>
          <Toolbar>
            <Box sx={{ marginTop: 20 }}>
              <Typography variant="body1" noWrap>
                You Logged in as {user.isAdmin ? "Admin" : "Manager"}
              </Typography>
            </Box>
          </Toolbar>
          <Toolbar>
            <Avatar
              alt={user.fullname}
              src={`${user.profileImage?.filepath}` || "default-avatar.png"}
            />
            <Box style={{ marginLeft: 13 }}>
              <Typography variant="h6" noWrap>
                {user.fullname}
              </Typography>
            </Box>
          </Toolbar>

          <ListItemButton
            component={Link}
            onClick={handleLogOut}
            className="sideNavItem"
          >
            <ListItemIcon className="sideNavIcon">
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </List>
      </Box>
    </Drawer>
  );
};

export default SideNav;
