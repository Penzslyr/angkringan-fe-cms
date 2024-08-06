import React, { useEffect, useState, useRef, forwardRef } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Button,
  createTheme,
  ThemeProvider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useReactToPrint } from "react-to-print";

const defaultTheme = createTheme();

// Wrap the Dashboard component with forwardRef
const Dashboard = forwardRef((props, ref) => {
  const [stats, setStats] = useState({
    usersCount: 0,
    promosCount: 0,
    activePromosCount: 0,
    reviewsCount: 0,
    transactionsCount: 0,
    transactionsTotal: 0.0,
  });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [
        usersResponse,
        promosResponse,
        reviewsResponse,
        transactionsResponse,
      ] = await Promise.all([
        axios.get("https://angkringan-backend.vercel.app/api/users"),
        axios.get("https://angkringan-backend.vercel.app/api/promos"),
        axios.get("https://angkringan-backend.vercel.app/api/reviews"),
        axios.get("https://angkringan-backend.vercel.app/api/transactions"),
      ]);

      const transactionsTotal = transactionsResponse.data.reduce(
        (total, transaction) => total + transaction.t_total,
        0
      );

      setStats({
        usersCount: usersResponse.data.length,
        promosCount: promosResponse.data.length,
        activePromosCount: promosResponse.data.filter(
          (promo) => promo.promo_status
        ).length,
        reviewsCount: reviewsResponse.data.length,
        transactionsCount: transactionsResponse.data.length,
        transactionsTotal: transactionsTotal.toFixed(2),
      });

      setTransactions(transactionsResponse.data);
    } catch (error) {
      console.error("Error fetching stats", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const transactionStatusData = transactions.reduce((acc, transaction) => {
    const status = transaction.t_status;
    if (!acc[status]) {
      acc[status] = 0;
    }
    acc[status]++;
    return acc;
  }, {});

  const chartData = Object.keys(transactionStatusData).map((key) => ({
    name: key,
    count: transactionStatusData[key],
  }));

  const menuSalesData = transactions.reduce((acc, transaction) => {
    transaction.t_items.forEach((item) => {
      if (!acc[item.menu_name]) {
        acc[item.menu_name] = 0;
      }
      acc[item.menu_name] += item.quantity;
    });
    return acc;
  }, {});

  const menuSalesChartData = Object.keys(menuSalesData).map((key) => ({
    name: key,
    count: menuSalesData[key],
  }));

  return (
    <ThemeProvider theme={defaultTheme}>
      {/* Pass the ref directly to the Box component */}
      <Box sx={{ flexGrow: 1, p: 3 }} ref={ref}>
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
            {/* Your existing code here for stats, charts, and tables */}
            <Grid item xs={12}>
              <Typography
                color="primary"
                variant="h4"
                component="h1"
                gutterBottom
              >
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

            <Grid item xs={12} sm={6} md={4}>
              <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                <Typography variant="h6" component="h2">
                  Total Reviews
                </Typography>
                <Typography variant="h3" component="p">
                  {stats.reviewsCount}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                <Typography variant="h6" component="h2">
                  Total Transactions
                </Typography>
                <Typography variant="h3" component="p">
                  {stats.transactionsCount}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                <Typography variant="h6" component="h2">
                  Total Sales
                </Typography>
                <Typography variant="h3" component="p">
                  Rp. {stats.transactionsTotal}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" component="h2">
                Transaction Status
              </Typography>
              <BarChart
                width={1200}
                height={300}
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" component="h2">
                High Selling Menu Items
              </Typography>
              <BarChart
                width={1200}
                height={300}
                data={menuSalesChartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" component="h2">
                  Transactions
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Account Name</TableCell>
                        <TableCell>Promo Name</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Total</TableCell>
                        <TableCell>Items</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {transactions.map((transaction) => (
                        <TableRow key={transaction._id}>
                          <TableCell>
                            {transaction.account_id.fullname}
                          </TableCell>
                          <TableCell>
                            {transaction?.promo_id?.promo_code
                              ? transaction?.promo_id?.promo_code
                              : "Empty"}
                          </TableCell>
                          <TableCell>{transaction.t_status}</TableCell>
                          <TableCell>Rp. {transaction.t_total}</TableCell>
                          <TableCell>
                            {transaction.t_items.map((item) => (
                              <Typography key={item.menu_id}>
                                {item.menu_name} - {item.quantity} x Rp.
                                {item.price}
                              </Typography>
                            ))}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Box>
    </ThemeProvider>
  );
});

const DashboardWrapper = () => {
  const dashboardRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => dashboardRef.current,
    documentTitle: "Dashboard Report",
  });

  return (
    <>
      <Button
        sx={{ marginLeft: "25px" }}
        variant="contained"
        color="primary"
        onClick={handlePrint}
      >
        Convert to PDF
      </Button>
      {/* Pass the ref to the Dashboard component */}
      <Dashboard ref={dashboardRef} />
    </>
  );
};

export default DashboardWrapper;
