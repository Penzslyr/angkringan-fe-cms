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
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import RateReviewIcon from "@mui/icons-material/RateReview";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import HistoryIcon from "@mui/icons-material/History";
import { Link, useLocation } from "react-router-dom";
import "../App.css";

const sideNavItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
  { text: "Manage User", icon: <GroupIcon />, path: "/manage-user" },
  { text: "Manage Menu", icon: <MenuBookIcon />, path: "/manage-menu" },
  { text: "Manage Promo", icon: <LocalOfferIcon />, path: "/manage-promo" },
  { text: "Manage Review", icon: <RateReviewIcon />, path: "/manage-review" },
  {
    text: "Manage Transactions",
    icon: <MonetizationOnIcon />,
    path: "/manage-transactions",
  },
  { text: "Logs", icon: <HistoryIcon />, path: "/logs" },
];

const SideNav = () => {
  const location = useLocation();

  const getItemStyle = (path) => {
    return location.pathname === path
      ? { backgroundColor: "rgba(0, 0, 0, 0.08)" }
      : {};
  };

  return (
    <Drawer variant="permanent" className="drawer">
      <Toolbar className="toolbar">
        <Typography variant="h6" noWrap>
          CMS Title
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
              <ListItemIcon className="sideNavIcon">{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default SideNav;
