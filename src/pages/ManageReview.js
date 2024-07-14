import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Grid,
  Button,
  Stack,
  createTheme,
  ThemeProvider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  TablePagination,
  InputAdornment,
  Select,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";

const defaultTheme = createTheme();

const ManageReviews = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [menus, setMenus] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    accountId: "",
    menuId: "",
    review_rate: 0,
    review_desc: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const url = "http://localhost:4000/api/reviews";
  const menusURL = "http://localhost:4000/api/menus";
  const accountsURL = "http://localhost:4000/api/users";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: response } = await axios.get(url);
        console.log("ini data", response);
        setData(response);
      } catch (error) {
        console.error(error.message);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }
    };

    const fetchMenus = async () => {
      try {
        const { data: response } = await axios.get(menusURL);
        setMenus(response);
        console.log(response);
      } catch (error) {
        console.error(error.message);
      }
    };

    const fetchAccounts = async () => {
      try {
        const { data: response } = await axios.get(accountsURL);
        setAccounts(response);
        console.log(response);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchData();
    fetchMenus();
    fetchAccounts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${url}/${id}`);
      const { data: response } = await axios.get(url);
      setData(response);
    } catch (error) {
      console.error(error.message);
    }
  };

  const filteredData = data?.filter((review) =>
    review.review_desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClickOpen = (data) => {
    setOpen(true);
    setFormData({
      id: data._id,
      accountId: data.accountId,
      menuId: data.menuId,
      review_rate: data.review_rate,
      review_desc: data.review_desc,
    });
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      id: null,
      accountId: "",
      menuId: "",
      review_rate: 0,
      review_desc: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const reviewData = {
      accountId: formData.accountId,
      menuId: formData.menuId,
      review_rate: formData.review_rate,
      review_desc: formData.review_desc,
    };

    try {
      if (formData.id) {
        await axios.put(`${url}/update/${formData.id}`, reviewData);
      } else {
        await axios.post(`${url}/create`, reviewData);
      }

      const { data: response } = await axios.get(url);
      setData(response);
    } catch (error) {
      console.error(error.message);
    }

    handleClose();
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box>
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Grid item xs={12}>
              <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography
                    component="h2"
                    variant="h4"
                    color="primary"
                    gutterBottom
                  >
                    Manage Reviews
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleClickOpen}
                  >
                    Add Review
                  </Button>
                </Box>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  placeholder="Search by description"
                  value={searchQuery}
                  onChange={handleSearch}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Account Name</TableCell>
                        <TableCell>Menu Name</TableCell>
                        <TableCell>Rating</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredData
                        ?.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((data, index) => (
                          <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{data.accountId?.fullname}</TableCell>
                            <TableCell>{data.menuId?.menu_name}</TableCell>
                            <TableCell>{data.review_rate}</TableCell>
                            <TableCell>{data.review_desc}</TableCell>
                            <TableCell>
                              <Stack spacing={2} direction="row">
                                <Button
                                  variant="outlined"
                                  startIcon={<EditIcon />}
                                  onClick={() => handleClickOpen(data)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="contained"
                                  endIcon={<DeleteIcon />}
                                  onClick={() => handleDelete(data._id)}
                                >
                                  Delete
                                </Button>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  component="div"
                  count={filteredData?.length || 0}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Paper>
            </Grid>
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>
                {formData.id ? "Edit Review" : "Add Review"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  {formData.id
                    ? "Edit the details of the review."
                    : "Enter the details of the new review."}
                </DialogContentText>
                <FormControl fullWidth margin="dense">
                  <FormLabel>Account</FormLabel>
                  <Select
                    name="accountId"
                    value={formData.accountId?._id}
                    onChange={handleChange}
                  >
                    {accounts.map((account) => (
                      <MenuItem key={account._id} value={account._id}>
                        {account.fullname}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="dense">
                  <FormLabel>Menu</FormLabel>
                  <Select
                    name="menuId"
                    value={formData.menuId?._id}
                    onChange={handleChange}
                  >
                    {menus.map((menu) => (
                      <MenuItem key={menu._id} value={menu._id}>
                        {menu.menu_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  margin="dense"
                  name="review_rate"
                  label="Rating"
                  type="number"
                  fullWidth
                  value={formData.review_rate}
                  onChange={handleChange}
                />
                <TextField
                  margin="dense"
                  name="review_desc"
                  label="Description"
                  type="text"
                  fullWidth
                  value={formData.review_desc}
                  onChange={handleChange}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSubmit}>
                  {formData.id ? "Update" : "Add"}
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default ManageReviews;
