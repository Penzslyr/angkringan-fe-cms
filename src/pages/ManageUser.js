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

const defaultTheme = createTheme();

const ManageUser = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    fullname: "",
    email: "",
    role: "",
    profileImage: null,
    existingProfileImage: null,
    isAdmin: false,
    isManager: false,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const baseURL = "http://localhost:4000/";
  const url = "http://localhost:4000/api/users";

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
      });
      setImagePreview(`${baseURL}${data.profileImage?.filepath}`);
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

  const handleSubmit = async () => {
    const userData = {
      fullname: formData.fullname,
      email: formData.email,
      isAdmin: formData.isAdmin,
      isManager: formData.isManager,
    };

    try {
      const formDataObj = new FormData();
      formDataObj.append("fullname", formData.fullname);
      formDataObj.append("email", formData.email);
      formDataObj.append("isAdmin", formData.isAdmin);
      formDataObj.append("isManager", formData.isManager);

      if (formData.profileImage) {
        formDataObj.append("profileImage", formData.profileImage);
      } else if (formData.existingProfileImage) {
        formDataObj.append(
          "existingProfileImage",
          formData.existingProfileImage.filepath
        );
      }

      if (formData.id) {
        console.log(JSON.stringify(formDataObj, null, 4));
        await axios.put(`${url}/${formData.id}`, formDataObj);
      } else {
        await axios.post(url, formDataObj);
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
      await axios.delete(`${url}/${id}`);
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
    (user) =>
      user.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
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
                    Manage Users
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleClickOpen()}
                  >
                    Add User
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
                        <TableCell>ID</TableCell>
                        <TableCell>Full Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Profile Image</TableCell>
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
                            <TableCell>{data.fullname}</TableCell>
                            <TableCell>{data.email}</TableCell>
                            <TableCell>
                              {data.isAdmin
                                ? "Admin"
                                : data.isManager
                                ? "Manager"
                                : "Customer"}{" "}
                            </TableCell>
                            <TableCell>
                              <img
                                src={`${baseURL}${data.profileImage?.filepath}`}
                                alt={data.profileImage?.filename}
                                style={{
                                  borderRadius: "50%",
                                  width: "130px",
                                  height: "130px",
                                }}
                              />
                            </TableCell>
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
                {formData.id ? "Edit User" : "Add User"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  {formData.id
                    ? "Edit the details of the user."
                    : "Enter the details of the new user."}
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
                    />
                    <FormControlLabel
                      value="manager"
                      control={<Radio />}
                      label="Manager"
                    />
                    <FormControlLabel
                      value="customer"
                      control={<Radio />}
                      label="Customer"
                    />
                  </RadioGroup>
                </FormControl>
                <input
                  accept="image/*"
                  type="file"
                  onChange={handleChange}
                  style={{ marginTop: 16 }}
                />
                {imagePreview && (
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
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleSubmit} color="primary">
                  {formData.id ? "Save Changes" : "Add User"}
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default ManageUser;
