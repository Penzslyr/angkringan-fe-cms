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
  TableSortLabel,
  Typography,
} from "@mui/material";

const LogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("timestamp");
  const url = "http://localhost:4000/api/logs";

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const response = await axios.get(url);
        setLogs(response.data);
      } catch (error) {
        console.error("Error fetching logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedLogs = logs.sort((a, b) => {
    if (orderBy === "timestamp") {
      return order === "asc"
        ? new Date(a.timestamp) - new Date(b.timestamp)
        : new Date(b.timestamp) - new Date(a.timestamp);
    }
    return 0; // Add other sorting conditions here if needed
  });

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Logs
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center">
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Action</TableCell>
                <TableCell>Entity</TableCell>
                <TableCell>Entity ID</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Details</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "timestamp"}
                    direction={orderBy === "timestamp" ? order : "asc"}
                    onClick={() => handleRequestSort("timestamp")}
                  >
                    Timestamp
                  </TableSortLabel>
                </TableCell>
                <TableCell>Previous Data</TableCell>
                <TableCell>New Data</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedLogs
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((log) => (
                  <TableRow key={log._id}>
                    <TableCell>{log.action}</TableCell>
                    <TableCell>{log.entity}</TableCell>
                    <TableCell>{log.entityId}</TableCell>
                    <TableCell>{log.user}</TableCell>
                    <TableCell>{log.details}</TableCell>
                    <TableCell>
                      {new Date(log.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {log.previousData
                        ? JSON.stringify(log.previousData, null, 2)
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {log.newData
                        ? JSON.stringify(log.newData, null, 2)
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={logs.length}
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

export default LogsPage;
