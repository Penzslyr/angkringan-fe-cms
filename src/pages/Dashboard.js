import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  createTheme,
  ThemeProvider,
} from "@mui/material";

const defaultTheme = createTheme();

const Dashboard = () => {
  const [stats, setStats] = useState({
    usersCount: 0,
    promosCount: 0,
    activePromosCount: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const usersResponse = await axios.get("http://localhost:4000/api/users");
      const promosResponse = await axios.get(
        "http://localhost:4000/api/promos"
      );

      setStats({
        usersCount: usersResponse.data.length,
        promosCount: promosResponse.data.length,
        activePromosCount: promosResponse.data.filter(
          (promo) => promo.promo_status
        ).length,
      });
    } catch (error) {
      console.error("Error fetching stats", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
          >
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h4" component="h1" gutterBottom>
                Dashboard
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                <Typography variant="h6" component="h2">
                  Total Users
                </Typography>
                <Typography variant="h3" component="p">
                  {stats.usersCount}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                <Typography variant="h6" component="h2">
                  Total Promos
                </Typography>
                <Typography variant="h3" component="p">
                  {stats.promosCount}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                <Typography variant="h6" component="h2">
                  Active Promos
                </Typography>
                <Typography variant="h3" component="p">
                  {stats.activePromosCount}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;
