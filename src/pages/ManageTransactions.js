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
  MenuItem,
  Paper,
  Select,
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
import { Edit, Delete, Add, Remove, Clear } from "@mui/icons-material";

const ManageTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [menus, setMenus] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const transactionsUrl =
    "https://angkringan-backend.vercel.app/api/transactions";
  const menusUrl = "https://angkringan-backend.vercel.app/api/menus";

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const response = await axios.get(transactionsUrl);
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchMenus = async () => {
      try {
        const response = await axios.get(menusUrl);
        setMenus(response.data);
      } catch (error) {
        console.error("Error fetching menus:", error);
      }
    };

    fetchTransactions();
    fetchMenus();
  }, []);

  useEffect(() => {
    updateTotalPrice();
  }, [selectedTransaction?.t_items]);

  const handleEditSave = async () => {
    try {
      const response = await axios.put(
        `${transactionsUrl}/${selectedTransaction._id}`,
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
      await axios.delete(`${transactionsUrl}/${selectedTransaction._id}`);
      setTransactions(
        transactions.filter((t) => t._id !== selectedTransaction._id)
      );
      handleDeleteClose();
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleAddMenuItem = () => {
    setSelectedTransaction((previousSelected) => ({
      ...previousSelected,
      t_items: [
        ...selectedTransaction.t_items,
        { menu_id: "", menu_name: "", quantity: 1, price: 0 },
      ],
    }));
    updateTotalPrice();
  };

  const handleRemoveMenuItem = (index) => {
    const updatedItems = selectedTransaction.t_items.filter(
      (_, i) => i !== index
    );
    setSelectedTransaction((previousSelected) => ({
      ...previousSelected,
      t_items: updatedItems,
    }));
    updateTotalPrice();
  };

  const handleMenuChange = (index, menuId) => {
    console.log("ini menu id", menuId);
    const menu = menus.find((m) => m._id === menuId);
    const updatedItems = selectedTransaction.t_items.map((item, i) =>
      i === index
        ? {
            ...item,
            menu_id: menu._id,
            menu_name: menu.menu_name,
            price: menu.menu_price,
          }
        : item
    );

    setSelectedTransaction((previousSelected) => ({
      ...previousSelected,
      t_items: updatedItems,
    }));
    updateTotalPrice();
  };

  const handleQuantityChange = (index, quantity) => {
    const updatedItems = selectedTransaction.t_items.map((item, i) =>
      i === index ? { ...item, quantity } : item
    );
    setSelectedTransaction((previousSelected) => ({
      ...previousSelected,
      t_items: updatedItems,
    }));
    updateTotalPrice();
  };

  const updateTotalPrice = () => {
    if (selectedTransaction) {
      const total = selectedTransaction.t_items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const promoDiscount = selectedTransaction.promo_id?.promo_price || 0;
      setSelectedTransaction((previousSelected) => ({
        ...previousSelected,
        t_total: total - promoDiscount,
      }));
      // setSelectedTransaction({
      //   ...selectedTransaction,
      //   t_total: total - promoDiscount,
      // });
      console.log("ini dari updatetotal", selectedTransaction);
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography color="primary" variant="h4" gutterBottom>
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
                <TableCell>Items</TableCell>
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
                      {transaction.t_items.map((item) => (
                        <div key={item.menu_id}>
                          {item.menu_name} (x{item.quantity})
                        </div>
                      ))}
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleEdit(transaction)}
                        startIcon={<Edit />}
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(transaction)}
                        startIcon={<Delete />}
                      >
                        Delete
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
              <Select
                margin="dense"
                label="Status"
                fullWidth
                value={selectedTransaction.t_status}
                onChange={(e) =>
                  setSelectedTransaction({
                    ...selectedTransaction,
                    t_status: e.target.value,
                  })
                }
              >
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Waiting for payment">
                  Waiting for payment
                </MenuItem>
                <MenuItem value="Processing">Processing</MenuItem>
                <MenuItem value="Canceled">Canceled</MenuItem>
              </Select>
              <TextField
                margin="dense"
                label="Total"
                type="number"
                fullWidth
                value={selectedTransaction.t_total}
                disabled
                // onChange={(e) => {
                //   setSelectedTransaction({
                //     ...selectedTransaction,
                //     t_total: e.target.value,
                //   });
                // }}
              />
              <Typography variant="h6" gutterBottom>
                Items
              </Typography>
              {selectedTransaction.t_items.map((item, index) => (
                <Box key={index} display="flex" alignItems="center">
                  <Select
                    margin="dense"
                    fullWidth
                    value={item.menu_id._id}
                    onChange={(e) => {
                      handleMenuChange(index, e.target.value);
                      console.log(e.target.value);
                    }}
                  >
                    {menus.map((menu) => (
                      <MenuItem key={menu._id} value={menu._id}>
                        {menu.menu_name}
                      </MenuItem>
                    ))}
                  </Select>
                  <TextField
                    margin="dense"
                    label="Quantity"
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(index, e.target.value)
                    }
                    sx={{ width: "300px", marginLeft: 2 }}
                  />
                  <Button
                    onClick={() => handleRemoveMenuItem(index)}
                    startIcon={<Clear />}
                    color="error"
                  />
                </Box>
              ))}
              <Button
                startIcon={<Add />}
                onClick={handleAddMenuItem}
                sx={{ marginTop: 2 }}
              >
                Add Menu
              </Button>
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
