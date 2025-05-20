'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Visibility as VisibilityIcon, Map as MapIcon } from '@mui/icons-material';
import axiosInstance from '../../../utils/axios';

export default function SellersPage() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/admin/login');
    },
  });
  
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    if (status === 'authenticated' && session?.accessToken) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${session.accessToken}`;
      fetchSellers();
    }
  }, [page, rowsPerPage, status, session]);

  const fetchSellers = async () => {
    try {
      const response = await axiosInstance.get(`/v1/admin/seller?page=${page + 1}&limit=${rowsPerPage}`);
      if (response.data.success) {
        setSellers(response.data.data.sellers);
        setTotalCount(response.data.data.pagination.total);
      }
    } catch (error) {
      console.error('Error fetching sellers:', error);
      if (error.response?.status === 401) {
        router.push('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'in-review':
        return 'warning';
      case 'blocked':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleViewDetails = (sellerId) => {
    router.push(`/admin/dashboard/sellers/${sellerId}`);
  };

  if (loading) {
    return (
      <Box className="flex items-center justify-center min-h-[400px]">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="p-6">
      <Box className="flex items-center justify-between mb-6">
        <Typography
          variant="h5"
          className="font-semibold"
          sx={{
            background: 'linear-gradient(135deg, #2b5876 0%, #4e4376 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Sellers Management
        </Typography>
        <Button
          variant="outlined"
          startIcon={<MapIcon />}
          onClick={() => router.push('/admin/dashboard/sellers/map')}
          sx={{
            borderColor: 'rgba(43, 88, 118, 0.5)',
            color: '#2b5876',
            '&:hover': {
              borderColor: '#2b5876',
              backgroundColor: 'rgba(43, 88, 118, 0.04)',
            },
          }}
        >
          Serviceable Zone
        </Button>
      </Box>
      
      <Paper elevation={0} className="overflow-hidden border border-gray-100">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Status</TableCell>
                
                <TableCell>Joined Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sellers.map((seller) => (
                <TableRow key={seller._id} hover>
                  <TableCell>{seller.name}</TableCell>
                  <TableCell>{seller.email}</TableCell>
                  <TableCell>{seller.phone}</TableCell>
                  <TableCell>{`${seller.business_address.split(' ').slice(0, 7).join(' ')} - ${seller.pincode}`}</TableCell>
                  <TableCell>
                    <Chip
                      label={seller.status}
                      color={getStatusColor(seller.status)}
                      size="small"
                    />
                  </TableCell>
                  
                  <TableCell>
                    {new Date(seller.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<VisibilityIcon />}
                      onClick={() => handleViewDetails(seller._id)}
                      sx={{
                        borderColor: 'rgba(43, 88, 118, 0.5)',
                        color: '#2b5876',
                        '&:hover': {
                          borderColor: '#2b5876',
                          backgroundColor: 'rgba(43, 88, 118, 0.04)',
                        },
                      }}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
