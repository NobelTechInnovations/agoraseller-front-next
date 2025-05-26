'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  CircularProgress,
  Box,
  Typography,
} from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';
import axiosInstance from '../../../../../utils/axios';
import Image from 'next/image';
import { format } from 'date-fns';
import S3Image from '../../../../../components/S3Image';


const statusColors = {
  'draft': 'default',
  'in-review': 'warning',
  'approved': 'success',
  'rejected': 'error',
  'suspended': 'error',
};

export default function SellerProducts() {
  const { id: sellerId } = useParams();
  const { data: session, status } = useSession();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (status === 'authenticated' && session?.accessToken) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${session.accessToken}`;
      fetchProducts();
    }
  }, [sellerId, status, session]);

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get(`/v1/admin/seller/${sellerId}/products`);
      if (response.data.success) {
        setProducts(response.data.data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClick = (event, product) => {
    setAnchorEl(event.currentTarget);
    setSelectedProduct(product);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProduct(null);
  };

  const handleStatusChange = async (newStatus) => {
    try {
      // Here you would make an API call to update the product status
       await axiosInstance.post(`/v1/admin/seller/${sellerId}/products/${selectedProduct.product_id}/status`, { status: newStatus });
      handleMenuClose();
      fetchProducts(); // Refresh the list after status change
    } catch (error) {
      console.error('Error updating product status:', error);
    }
  };

  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-screen">
        <CircularProgress />
      </Box>
    );
  }

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="p-6">
      <Typography variant="h5" className="mb-6">
        Seller Products
      </Typography>
      
      <TableContainer component={Paper} className="shadow-lg">
        <Table>
          <TableHead>
            <TableRow className="bg-gray-50">
              <TableCell>Image</TableCell>
              <TableCell>Product ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((item) => (
              <TableRow key={item._id} className="hover:bg-gray-50">
                <TableCell>
                  {item.product.images[0]?.thumbnail_image && (
                    <div className="relative w-16 h-16">
                      
                      <S3Image 
                        src={item.product.images[0].thumbnail_image}
                        alt={item.product.descriptions[0]?.title || 'Product image'}
                        className="object-cover rounded"
                        width={64}
                        height={64}
                      />
                    </div>
                  )}
                </TableCell>
                <TableCell>{item.product_id}</TableCell>
                <TableCell>{item.product.descriptions[0]?.title}</TableCell>
                <TableCell>{item.product.category_id?.name}</TableCell>
                <TableCell>
                  <Chip
                    label={item.product.status}
                    color={statusColors[item.product.status] || 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {formatDate(item.createdAt)}
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuClick(e, item)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleStatusChange('published')}>
          Approve
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('varification_failed')}>
          Reject
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('suspended')}>
          Suspend
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('in-review')}>
          Mark for Review
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('archived')}>
          Delete
        </MenuItem>
      </Menu>
    </div>
  );
}
