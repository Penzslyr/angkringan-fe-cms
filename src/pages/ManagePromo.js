import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';

const ManagePromo = () => {
    const rows = [
        { id: 1, code: 'PROMO10', discount: '10%' },
        { id: 2, code: 'PROMO20', discount: '20%' }
    ];

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Manage Promo</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Code</TableCell>
                            <TableCell>Discount</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.code}</TableCell>
                                <TableCell>{row.discount}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default ManagePromo;
