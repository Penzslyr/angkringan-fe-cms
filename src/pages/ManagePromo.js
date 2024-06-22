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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { useAuth } from "../middleware/AuthProvider";

const defaultTheme = createTheme();

const ManagePromo = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    promo_code: "",
    promo_desc: "",
    promo_status: false,
    promo_price: "",
    userId: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const url = "http://localhost:4000/api/promos";

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

  const handleClickOpen = (promo) => {
    setOpen(true);
    setFormData({
      id: promo._id,
      promo_code: promo.promo_code,
      promo_desc: promo.promo_desc,
      promo_status: promo.promo_status,
      promo_price: promo.promo_price,
    });
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      promo_code: "",
      promo_desc: "",
      promo_status: false,
      promo_price: "",
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    const promoData = {
      promo_code: formData.promo_code,
      promo_desc: formData.promo_desc,
      promo_status: formData.promo_status,
      promo_price: formData.promo_price,
      userId: user._id,
    };

    try {
      if (formData.id) {
        await axios.put(`${url}/update/${formData.id}`, promoData);
      } else {
        await axios.post(`${url}/create`, promoData);
      }

      const { data: response } = await axios.get(url);
      setData(response);
    } catch (error) {
      console.error(error);
    }

    handleClose();
  };

  const handleDelete = async (id) => {
    try {
      const reqBody = { userId: user._id };
      await axios.delete(`${url}/delete/${id}`, {
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
    (promo) =>
      promo.promo_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      promo.promo_desc.toLowerCase().includes(searchQuery.toLowerCase())
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
                    Manage Promos
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleClickOpen({})}
                  >
                    Add Promo
                  </Button>
                </Box>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  placeholder="Search by code or description"
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
                        <TableCell>Code</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredData
                        ?.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((promo, index) => (
                          <TableRow key={promo._id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{promo.promo_code}</TableCell>
                            <TableCell>{promo.promo_desc}</TableCell>
                            <TableCell>
                              {promo.promo_status ? "Active" : "Inactive"}
                            </TableCell>
                            <TableCell>{promo.promo_price}</TableCell>
                            <TableCell>
                              <Stack spacing={2} direction="row">
                                <Button
                                  variant="outlined"
                                  startIcon={<EditIcon />}
                                  onClick={() => handleClickOpen(promo)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="contained"
                                  endIcon={<DeleteIcon />}
                                  onClick={() => handleDelete(promo._id)}
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
                {formData.id ? "Edit Promo" : "Add Promo"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  {formData.id
                    ? "Edit the details of the promo."
                    : "Enter the details for the new promo."}
                </DialogContentText>
                <TextField
                  autoFocus
                  margin="dense"
                  name="promo_code"
                  label="Code"
                  type="text"
                  fullWidth
                  value={formData.promo_code}
                  onChange={handleChange}
                />
                <TextField
                  margin="dense"
                  name="promo_desc"
                  label="Description"
                  type="text"
                  fullWidth
                  value={formData.promo_desc}
                  onChange={handleChange}
                />
                <TextField
                  margin="dense"
                  name="promo_price"
                  label="Price"
                  type="number"
                  fullWidth
                  value={formData.promo_price}
                  onChange={handleChange}
                />
                <FormControl component="fieldset" margin="dense">
                  <FormLabel component="legend">Status</FormLabel>
                  <RadioGroup
                    row
                    name="promo_status"
                    value={formData.promo_status}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      value={true}
                      control={<Radio />}
                      label="Active"
                    />
                    <FormControlLabel
                      value={false}
                      control={<Radio />}
                      label="Inactive"
                    />
                  </RadioGroup>
                </FormControl>
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

export default ManagePromo;
