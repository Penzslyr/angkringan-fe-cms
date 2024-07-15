import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  CircularProgress,
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
  IconButton,
  Collapse,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [entityFilter, setEntityFilter] = useState("");
  const [open, setOpen] = useState({});

  const url = "https://angkringan-backend.vercel.app/api/logs";

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const response = await axios.get(url);
        setLogs(response.data);
        setFilteredLogs(response.data);
      } catch (error) {
        console.error("Error fetching logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  useEffect(() => {
    let filtered = logs.filter((log) =>
      Object.values(log).some((value) =>
        JSON.stringify(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    if (entityFilter) {
      filtered = filtered.filter((log) => log.entity === entityFilter);
    }

    setFilteredLogs(filtered);
    setPage(0);
  }, [searchTerm, entityFilter, logs]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleEntityFilterChange = (event) => {
    setEntityFilter(event.target.value);
  };

  const handleToggle = (id) => {
    setOpen((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const formatData = (data) => {
    return (
      <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    );
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Logs
      </Typography>
      <Box display="flex" gap={2} sx={{ marginBottom: 2 }}>
        <TextField
          label="Search"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <FormControl variant="outlined" fullWidth>
          <InputLabel>Entity</InputLabel>
          <Select
            value={entityFilter}
            onChange={handleEntityFilterChange}
            label="Entity"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="User">User</MenuItem>
            <MenuItem value="Menu">Menu</MenuItem>
            <MenuItem value="Promo">Promo</MenuItem>
            <MenuItem value="Transaction">Transaction</MenuItem>
            <MenuItem value="Review">Review</MenuItem>
          </Select>
        </FormControl>
      </Box>
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
                <TableCell>Action</TableCell>
                <TableCell>Entity</TableCell>
                <TableCell>Entity ID</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Details</TableCell>
                <TableCell>Timestamp</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLogs
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((log) => (
                  <React.Fragment key={log._id}>
                    <TableRow>
                      <TableCell>{log.action}</TableCell>
                      <TableCell>{log.entity}</TableCell>
                      <TableCell>{log.entityId}</TableCell>
                      <TableCell>{log.user}</TableCell>
                      <TableCell>{log.details}</TableCell>
                      <TableCell>
                        {new Date(log.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleToggle(log._id)}>
                          {open[log._id] ? (
                            <KeyboardArrowUp />
                          ) : (
                            <KeyboardArrowDown />
                          )}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                      >
                        <Collapse
                          in={open[log._id]}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box margin={2}>
                            <Typography variant="subtitle1">
                              Previous Data:
                            </Typography>
                            {log.previousData
                              ? formatData(log.previousData)
                              : "N/A"}
                            <Typography variant="subtitle1">
                              New Data:
                            </Typography>
                            {log.newData ? formatData(log.newData) : "N/A"}
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={filteredLogs.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      )}
    </Box>
  );
};

export default Logs;
