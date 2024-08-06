import { CssBaseline, Box, Toolbar } from "@mui/material";
import SideNav from "../components/SideNav";
import { Outlet } from "react-router-dom";

export default function Root() {
  return (
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
          minWidth: "186vh",
          overflow: "auto",
          width: "100%",
          paddingX: "24px",
          paddingBottom: "24px",
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
