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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";

const defaultTheme = createTheme();

const ManageTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:4000/api/transactions"
      );
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleEditClick = (transaction) => {
    setCurrentTransaction(transaction);
    setOpen(true);
  };

  const handleDeleteClick = async (transactionId) => {
    try {
      await axios.delete(
        `http://localhost:4000/api/transactions/${transactionId}`
      );
      fetchTransactions(); // Refresh the transactions list
    } catch (error) {
      console.error("Error deleting transaction", error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentTransaction(null);
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `http://localhost:4000/api/transactions/${currentTransaction._id}`,
        currentTransaction
      );
      fetchTransactions(); // Refresh the transactions list
      handleClose();
    } catch (error) {
      console.error("Error saving transaction", error);
    }
  };

  const handleChange = (e) => {
    setCurrentTransaction({
      ...currentTransaction,
      [e.target.name]: e.target.value,
    });
  };

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
                Manage Transactions
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Account Name</TableCell>
                      <TableCell>Promo Code</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Total</TableCell>
                      <TableCell>Items</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction._id}>
                        <TableCell>{transaction.account_id.fullname}</TableCell>
                        <TableCell>{transaction.promo_id.promo_code}</TableCell>
                        <TableCell>{transaction.t_status}</TableCell>
                        <TableCell>${transaction.t_total}</TableCell>
                        <TableCell>
                          {transaction.t_items.map((item) => (
                            <Typography key={item._id}>
                              {item.menu_name} - {item.quantity} x ${item.price}
                            </Typography>
                          ))}
                        </TableCell>
                        <TableCell>
                          <Button
                            onClick={() => handleEditClick(transaction)}
                            color="primary"
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDeleteClick(transaction._id)}
                            color="secondary"
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        )}

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Edit Transaction</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Edit the details of the transaction below.
            </DialogContentText>
            {currentTransaction && (
              <Box component="form" sx={{ mt: 2 }}>
                <TextField
                  margin="dense"
                  name="t_status"
                  label="Status"
                  type="text"
                  fullWidth
                  value={currentTransaction.t_status}
                  onChange={handleChange}
                />
                <TextField
                  margin="dense"
                  name="t_total"
                  label="Total"
                  type="number"
                  fullWidth
                  value={currentTransaction.t_total}
                  onChange={handleChange}
                />
                {/* Add more fields as necessary */}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSave} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default ManageTransactions;
