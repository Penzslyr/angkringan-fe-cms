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

const baseURL = "http://localhost:4000/";

const sideNavItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/Dashboard" },
  { text: "Manage User", icon: <GroupIcon />, path: "/ManageUser" },
  { text: "Manage Menu", icon: <MenuBookIcon />, path: "/ManageMenu" },
  { text: "Manage Promo", icon: <LocalOfferIcon />, path: "/ManagePromo" },
  { text: "Manage Review", icon: <RateReviewIcon />, path: "/ManageReview" },
  {
    text: "Manage Transactions",
    icon: <MonetizationOnIcon />,
    path: "/ManageTransactions",
  },
  { text: "Logs", icon: <HistoryIcon />, path: "/Logs" },
  { text: "Logout", icon: <LogoutIcon />, path: "/logout" },
];

const lastElement = sideNavItems[sideNavItems.length - 1];

const SideNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const getItemStyle = (path) => {
    return location.pathname === path
      ? { backgroundColor: "rgba(0, 0, 0, 0.08)" }
      : {};
  };

  const handleLogOut = () => {
    logout();
    navigate("/");
  };

  return (
    <Drawer variant="permanent" className="drawer">
      <Toolbar className="toolbar">
        <Typography sx={{ textTransform: "uppercase" }} variant="h6" noWrap>
          Bonsuwong CMS
        </Typography>
      </Toolbar>
      <Box className="sideNavBox">
        <Toolbar sx={{ marginTop: "20px" }}>
          <Avatar
            alt={user.fullname}
            src={
              `${baseURL}${user.profileImage?.filepath}` || "default-avatar.png"
            }
          />
          <Box style={{ marginLeft: 16 }}>
            <Typography variant="h6" noWrap>
              {user.fullname}
            </Typography>
          </Box>
        </Toolbar>
        <List className="sideNavList">
          {sideNavItems.slice(0, -1).map((item, index) => (
            <ListItem
              button
              key={index}
              component={Link}
              to={item.path}
              className="sideNavItem"
              style={getItemStyle(item.path)}
            >
              <ListItemIcon className="sideNavIcon">{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
        <List style={{ position: "absolute", bottom: "0", width: "100%" }}>
          <ListItemButton
            button
            component={Link}
            onClick={() => handleLogOut()}
            // to={sideNavItems[7].path}
            className="sideNavItem"
            style={getItemStyle(sideNavItems[7].path)}
          >
            <ListItemIcon className="sideNavIcon">
              {sideNavItems[7].icon}
            </ListItemIcon>
            <ListItemText primary={sideNavItems[7].text} />
          </ListItemButton>
        </List>
      </Box>
    </Drawer>
  );
};

export default SideNav;
