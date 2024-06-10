import React from "react";
import { CssBaseline, Box, Toolbar } from "@mui/material";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SideNav from "./components/SideNav";
import Dashboard from "./pages/Dashboard";
import ManageUser from "./pages/ManageUser";
import ManageMenu from "./pages/ManageMenu";
import ManagePromo from "./pages/ManagePromo";
import "./App.css";
import ManageReview from "./pages/ManageReview";
import LoginPage from "./pages/LoginPage";

function App() {
  const token = localStorage.getItem("token");
  if (!token) {
    return <LoginPage />;
  }
  return (
    <Router>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <SideNav />
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            minWidth: "185vh",
            overflow: "auto",
            width: 1,
            paddingX: "24px",
            paddingBottom: "24px",
          }}
        >
          <Toolbar />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/manage-user" element={<ManageUser />} />
            <Route path="/manage-menu" element={<ManageMenu />} />
            <Route path="/manage-promo" element={<ManagePromo />} />
            <Route path="/manage-review" element={<ManageReview />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
