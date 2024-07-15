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
  TablePagination,
  InputAdornment,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { useAuth } from "../middleware/AuthProvider";

const defaultTheme = createTheme();

const ManageMenu = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    menu_name: "",
    menu_price: "",
    menu_desc: "",
    menu_img: null,
    menu_category: "",
    menu_stock: 0,
    existingMenu_img: null,
    userId: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const url = "https://angkringan-backend.vercel.app/api/menus";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: response } = await axios.get(url);
        setData(response);
      } catch (error) {
        console.error(error.message);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }
    };

    fetchData();
  }, []);

  const handleClickOpen = (data) => {
    setOpen(true);
    if (data) {
      setFormData({
        id: data._id,
        menu_name: data.menu_name,
        menu_price: data.menu_price,
        menu_desc: data.menu_desc,
        menu_stock: data.menu_stock,
        menu_img: null,
        existingMenu_img: data.menu_img,
        menu_category: data.menu_category,
      });
      setImagePreview(`${data.menu_img?.filepath}`);
    } else {
      setFormData({
        id: null,
        menu_name: "",
        menu_price: "",
        menu_desc: "",
        menu_stock: 0,
        menu_img: null,
        existingMenu_img: null,
        menu_category: "",
      });
      setImagePreview(null);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      id: null,
      menu_name: "",
      menu_price: "",
      menu_desc: "",
      menu_stock: 0,
      menu_img: null,
      existingMenu_img: null,
      menu_category: "",
    });
    setImagePreview(null);
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0];
      setFormData((prevData) => ({
        ...prevData,
        menu_img: file,
      }));
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    const formDataObj = new FormData();
    formDataObj.append("menu_name", formData.menu_name);
    formDataObj.append("menu_price", formData.menu_price);
    formDataObj.append("menu_desc", formData.menu_desc);
    formDataObj.append("menu_stock", formData.menu_stock);
    formDataObj.append("userId", user._id);
    formDataObj.append("menu_category", formData.menu_category);

    if (formData.menu_img) {
      formDataObj.append("menu_img", formData.menu_img);
    }

    try {
      if (formData.id) {
        await axios.put(`${url}/${formData.id}`, formDataObj);
      } else {
        await axios.post(`${url}/create`, formDataObj);
      }

      const { data: response } = await axios.get(url);
      setData(response);
    } catch (error) {
      console.error(error.message);
    }

    handleClose();
  };

  const handleDelete = async (id) => {
    try {
      console.log(`deleting ${id}`);

      await axios.delete(`${url}/${id}`, {
        data: { userId: user._id },
      });
      const { data: response } = await axios.get(url);
      setData(response);
    } catch (error) {
      console.error(error.message);
    }
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

  const filteredData = data?.filter(
    (menu) =>
      menu.menu_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      menu.menu_desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                    Manage Menus
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleClickOpen(null)}
                  >
                    Add Menu
                  </Button>
                </Box>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  placeholder="Search by name or description"
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
                        <TableCell>Menu Name</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Stock</TableCell>
                        <TableCell>Image</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredData
                        ?.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((menu, index) => (
                          <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{menu.menu_name}</TableCell>
                            <TableCell>{menu.menu_price}</TableCell>
                            <TableCell>{menu.menu_desc}</TableCell>
                            <TableCell>{menu.menu_stock}</TableCell>
                            <TableCell>
                              <img
                                src={`${menu.menu_img?.filepath}`}
                                alt={menu.menu_img?.filename}
                                style={{
                                  width: "200px",
                                  height: "130px",
                                }}
                              />
                            </TableCell>
                            <TableCell>{menu.menu_category}</TableCell>
                            <TableCell>
                              <Stack spacing={2} direction="row">
                                <Button
                                  variant="outlined"
                                  startIcon={<EditIcon />}
                                  onClick={() => handleClickOpen(menu)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="contained"
                                  endIcon={<DeleteIcon />}
                                  onClick={() => handleDelete(menu._id)}
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
                {formData.id ? "Edit Menu" : "Add Menu"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  {formData.id
                    ? "Edit the details of the menu."
                    : "Enter the details of the new menu."}
                </DialogContentText>
                <TextField
                  autoFocus
                  margin="dense"
                  name="menu_name"
                  label="Menu Name"
                  type="text"
                  fullWidth
                  value={formData.menu_name}
                  onChange={handleChange}
                />
                <FormControl fullWidth margin="dense">
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="menu_category"
                    value={formData.menu_category}
                    onChange={handleChange}
                    label={"Category"}
                  >
                    <MenuItem value="Food">Food</MenuItem>
                    <MenuItem value="Beverage">Beverage</MenuItem>
                    <MenuItem value="Snack">Snack</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  margin="dense"
                  name="menu_price"
                  label="Price"
                  type="number"
                  fullWidth
                  value={formData.menu_price}
                  onChange={handleChange}
                />
                <TextField
                  margin="dense"
                  name="menu_desc"
                  label="Description"
                  type="text"
                  fullWidth
                  value={formData.menu_desc}
                  onChange={handleChange}
                />
                <TextField
                  margin="dense"
                  name="menu_stock"
                  label="Stock"
                  type="number"
                  fullWidth
                  value={formData.menu_stock}
                  onChange={handleChange}
                />

                <input
                  type="file"
                  name="menu_img"
                  onChange={handleChange}
                  style={{ marginTop: "15px" }}
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      borderRadius: "50%",
                      width: "130px",
                      height: "130px",
                      marginTop: "15px",
                    }}
                  />
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="secondary">
                  Cancel
                </Button>
                <Button onClick={handleSubmit} color="primary">
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

export default ManageMenu;
