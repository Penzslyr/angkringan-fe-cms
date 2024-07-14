import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const ManageTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const url = "http://localhost:4000/api/transactions";

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const response = await axios.get(url);
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const handleEditSave = async () => {
    try {
      const response = await axios.put(
        `${url}/${selectedTransaction._id}`,
        selectedTransaction
      );
      setTransactions(
        transactions.map((t) =>
          t._id === response.data._id ? response.data : t
        )
      );
      handleEditClose();
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${url}/${selectedTransaction._id}`);
      setTransactions(
        transactions.filter((t) => t._id !== selectedTransaction._id)
      );
      handleDeleteClose();
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  }

  const handleEdit = (transaction) => {
    setSelectedTransaction(transaction);
    setEditDialogOpen(true);
  };

  const handleDelete = (transaction) => {
    setSelectedTransaction(transaction);
    setDeleteDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
    setSelectedTransaction(null);
  };

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
    setSelectedTransaction(null);
  };
;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Manage Transactions
      </Typography>
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ height: "100vh" }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Account</TableCell>
                <TableCell>Promo</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((transaction) => (
                  <TableRow key={transaction._id}>
                    <TableCell>{transaction.account_id.fullname}</TableCell>
                    <TableCell>{transaction?.promo_id?.promo_code}</TableCell>
                    <TableCell>{transaction.t_status}</TableCell>
                    <TableCell>Rp. {transaction.t_total.toFixed(2)}</TableCell>
                    <TableCell>
                      {new Date(transaction.t_date).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Button onClick={() => handleEdit(transaction)}>
                        <Edit />
                      </Button>
                      <Button onClick={() => handleDelete(transaction)}>
                        <Delete />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={transactions.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      )}
      <Dialog open={editDialogOpen} onClose={handleEditClose}>
        <DialogTitle>Edit Transaction</DialogTitle>
        <DialogContent>
          {selectedTransaction && (
            <>
              <TextField
                margin="dense"
                label="Status"
                type="text"
                fullWidth
                value={selectedTransaction.t_status}
                onChange={(e) =>
                  setSelectedTransaction({
                    ...selectedTransaction,
                    t_status: e.target.value,
                  })
                }
              />
              <TextField
                margin="dense"
                label="Total"
                type="number"
                fullWidth
                value={selectedTransaction.t_total}
                onChange={(e) =>
                  setSelectedTransaction({
                    ...selectedTransaction,
                    t_total: e.target.value,
                  })
                }
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteDialogOpen} onClose={handleDeleteClose}>
        <DialogTitle>Delete Transaction</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this transaction?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageTransactions;
