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
  Alert,
  Snackbar,
  Backdrop,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useAuth } from "../middleware/AuthProvider";

const defaultTheme = createTheme();

const ManageCustomers = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingDelete, setLoadingDelete] = React.useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    fullname: "",
    email: "",
    password: "",
    date: dayjs(),
    role: "customer",
    profileImage: null,
    existingProfileImage: null,
    isAdmin: false,
    isManager: false,
    userId: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("customer");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [notifbar, setNotifbar] = useState(false);
  const [notifbarerror, setNotifbarerror] = useState(false);

  const url = "https://angkringan-backend.vercel.app/api/users";

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

  const handleCloseNotif = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setNotifbar(false);
    setNotifbarerror(false);
  };

  const handleClickOpen = (data = null) => {
    if (data) {
      setFormData({
        id: data._id,
        fullname: data.fullname,
        email: data.email,
        role: data.isAdmin ? "admin" : data.isManager ? "manager" : "customer",
        profileImage: null,
        existingProfileImage: data.profileImage,
        isAdmin: data.isAdmin,
        isManager: data.isManager,
        password: data.password,
        date: dayjs(data.date),
      });
      setImagePreview(`${data.profileImage?.filepath}`);
    } else {
      setFormData({
        id: null,
        fullname: "",
        email: "",
        role: "",
        profileImage: null,
        existingProfileImage: null,
        isAdmin: false,
        isManager: false,
        password: "",
        date: dayjs(),
      });
      setImagePreview(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      id: null,
      fullname: "",
      email: "",
      role: "",
      profileImage: null,
      existingProfileImage: null,
      isAdmin: false,
      isManager: false,
      password: "",
      date: dayjs(),
    });
    setImagePreview(null);
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0];
      setFormData((prevData) => ({
        ...prevData,
        profileImage: file,
      }));
      setImagePreview(URL.createObjectURL(file));
    } else {
      if (name === "role") {
        setFormData((prevData) => ({
          ...prevData,
          role: value,
          isAdmin: value === "admin",
          isManager: value === "manager",
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    }
  };

  const handleDateChange = (newValue) => {
    setFormData((prevData) => ({
      ...prevData,
      date: newValue,
    }));
  };

  const handleSubmit = async () => {
    const userData = {
      fullname: formData.fullname,
      email: formData.email,
      password: "1234567",
      date: formData.date.format(),
      isAdmin: formData.isAdmin,
      isManager: formData.isManager,
      profileImage: formData.profileImage,
      userId: user._id,
    };

    try {
      const formDataObj = new FormData();
      formDataObj.append("fullname", formData.fullname);
      formDataObj.append("email", formData.email);
      formDataObj.append("isAdmin", formData.isAdmin);
      formDataObj.append("isManager", formData.isManager);
      formDataObj.append("password", formData.password);
      formDataObj.append("date", userData.date);
      formDataObj.append("userId", user._id);

      if (formData.profileImage) {
        formDataObj.append("profileImage", formData.profileImage);
      } else if (formData.existingProfileImage) {
        formDataObj.append(
          "existingProfileImage",
          formData.existingProfileImage.filepath
        );
      }

      if (formData.id) {
        await axios.put(`${url}/${formData.id}`, formDataObj);
      } else {
        await axios.post(url, formDataObj).then(setNotifbar(true));
      }

      const { data: response } = await axios.get(url);
      setData(response);
    } catch (error) {
      console.error(error.message);
    }

    handleClose();
  };

  const handleDelete = async (id) => {
    setLoadingDelete(true);
    try {
      const reqBody = { userId: user._id };
      await axios.delete(`${url}/${id}`, {
        data: { userId: user._id },
      });
      const { data: response } = await axios.get(url);
      setData(response);
      setLoadingDelete(false);
    } catch (error) {
      console.error(error.message);
      setNotifbarerror(true);
    }
    setLoadingDelete(false);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleRoleFilterChange = (e) => {
    setRoleFilter(e.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const filteredData = data?.filter(
    (user) =>
      roleFilter === "customer" &&
      !user.isAdmin &&
      !user.isManager &&
      (user.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()))
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
                    Manage Customers
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleClickOpen()}
                  >
                    Add Customers
                  </Button>
                </Box>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  placeholder="Search by name or email"
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
                        <TableCell>Profile Picture</TableCell>
                        <TableCell>Full Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredData
                        ?.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((user) => (
                          <TableRow key={user._id}>
                            <TableCell>
                              <img
                                src={`${user.profileImage?.filepath}`}
                                alt={user.profileImage?.filename}
                                style={{
                                  borderRadius: "50%",
                                  width: "130px",
                                  height: "130px",
                                }}
                              />
                            </TableCell>
                            <TableCell>{user.fullname}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              {dayjs(user.date).format("DD-MM-YYYY")}
                            </TableCell>
                            <TableCell>
                              {user.isAdmin
                                ? "Admin"
                                : user.isManager
                                ? "Manager"
                                : "Customer"}
                            </TableCell>
                            <TableCell>
                              <Stack direction="row" spacing={1}>
                                <Button
                                  variant="outlined"
                                  color="primary"
                                  startIcon={<EditIcon />}
                                  onClick={() => handleClickOpen(user)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="contained"
                                  startIcon={<DeleteIcon />}
                                  onClick={() => handleDelete(user._id)}
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
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={filteredData?.length || 0}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Paper>
            </Grid>

            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>
                {formData.id ? "Edit Customers" : "Add Customers"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  {formData.id
                    ? "Edit the details of the Customers."
                    : "Enter the details of the new Customers."}
                </DialogContentText>
                <TextField
                  autoFocus
                  margin="dense"
                  name="fullname"
                  label="Full Name"
                  type="text"
                  fullWidth
                  value={formData.fullname}
                  onChange={handleChange}
                />
                <TextField
                  margin="dense"
                  name="email"
                  label="Email"
                  type="email"
                  fullWidth
                  value={formData.email}
                  onChange={handleChange}
                />
                <TextField
                  margin="dense"
                  name="password"
                  label="Password"
                  type="password"
                  fullWidth
                  value={formData?.password}
                  onChange={handleChange}
                />
                <div style={{ paddingTop: "8px" }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Date"
                      value={formData.date}
                      onChange={handleDateChange}
                      renderInput={(params) => (
                        <TextField {...params} margin="dense" fullWidth />
                      )}
                    />
                  </LocalizationProvider>
                </div>
                <FormControl component="fieldset" margin="dense">
                  <FormLabel component="legend">Role</FormLabel>
                  <RadioGroup
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      value="admin"
                      control={<Radio />}
                      label="Admin"
                      disabled
                    />
                    <FormControlLabel
                      value="manager"
                      control={<Radio />}
                      label="Manager"
                      disabled
                    />
                    <FormControlLabel
                      value="customer"
                      control={<Radio />}
                      label="Customer"
                    />
                  </RadioGroup>
                </FormControl>
                <div>
                  <input
                    accept="image/*"
                    type="file"
                    onChange={handleChange}
                    style={{ marginTop: 16 }}
                  />
                  {imagePreview && (
                    <div style={{ paddingTop: "8px" }}>
                      <img
                        src={imagePreview}
                        alt="Profile Preview"
                        style={{
                          borderRadius: "50%",
                          width: "130px",
                          height: "130px",
                          marginTop: 16,
                        }}
                      />
                    </div>
                  )}
                </div>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
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
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={notifbar}
        autoHideDuration={600}
        onClose={handleCloseNotif}
      >
        <Alert
          onClose={handleCloseNotif}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Action Success!
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={notifbarerror}
        autoHideDuration={600}
        onClose={handleCloseNotif}
      >
        <Alert
          onClose={handleCloseNotif}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Something went wrong!
        </Alert>
      </Snackbar>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loadingDelete}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </ThemeProvider>
  );
};

export default ManageCustomers;
