'use client';

import { useState, useEffect, use } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  CircularProgress,
  Button,
  Divider,
  Stack,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  ArrowBack as ArrowBackIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  AccountBalance as AccountBalanceIcon,
  LocationOn as LocationIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Block as BlockIcon,
  Map as MapIcon,
} from '@mui/icons-material';
import axiosInstance from '../../../../utils/axios';

export default function SellerDetailsPage({ params }) {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/admin/login');
    },
  });
  
  const sellerId = use(params).id;
  const [sellerData, setSellerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (status === 'authenticated' && session?.accessToken) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${session.accessToken}`;
      fetchSellerDetails();
    }
  }, [sellerId, status, session]);

  const fetchSellerDetails = async () => {
    try {
      const response = await axiosInstance.get(`/v1/admin/seller/${sellerId}`);
      if (response.data.success) {
        setSellerData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching seller details:', error);
      if (error.response?.status === 401) {
        router.push('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApproveAccount = async () => {
    try {
      setActionLoading(true);
      const response = await axiosInstance.post(`/v1/admin/seller/${sellerId}/approve`);
      if (response.data.success) {
        // Refresh seller details to show updated status
        fetchSellerDetails();
      }
    } catch (error) {
      console.error('Error approving seller:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleBlockAccount = async () => {
    try {
      setActionLoading(true);
      const response = await axiosInstance.post(`/v1/admin/seller/${sellerId}/block`);
      if (response.data.success) {
        // Refresh seller details to show updated status
        fetchSellerDetails();
      }
    } catch (error) {
      console.error('Error blocking seller:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewServiceableZone = () => {
    router.push(`/admin/dashboard/sellers/${sellerId}/zone`);
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

  if (loading) {
    return (
      <Box className="flex items-center justify-center min-h-[400px]">
        <CircularProgress />
      </Box>
    );
  }

  if (!sellerData) {
    return (
      <Box className="p-6">
        <Typography variant="h6" color="error">
          Seller not found
        </Typography>
      </Box>
    );
  }

  const { seller, businessDetails, bankDetails } = sellerData;

  return (
    <Box className="p-6">
      <Box className="flex items-center justify-between mb-6">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.back()}
          sx={{
            color: '#2b5876',
            '&:hover': {
              backgroundColor: 'rgba(43, 88, 118, 0.04)',
            },
          }}
        >
          Back to Sellers
        </Button>
        <Stack direction="row" spacing={2} alignItems="center">
          <Button
            variant="contained"
            onClick={() => router.push(`/admin/dashboard/sellers/${sellerId}/products`)}
          >
            View Products
          </Button>

          <Chip
            label={seller.status}
            color={getStatusColor(seller.status)}
            sx={{ textTransform: 'capitalize' }}
          />
          {seller.status === 'in-review' && (
            <Button
              variant="contained"
              startIcon={<CheckCircleIcon />}
              onClick={handleApproveAccount}
              disabled={actionLoading}
              sx={{
                background: 'linear-gradient(135deg, #2b5876 0%, #4e4376 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4e4376 0%, #2b5876 100%)',
                },
              }}
            >
              {actionLoading ? 'Processing...' : 'Approve Account'}
            </Button>
          )}
          {seller.status === 'active' && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<BlockIcon />}
              onClick={handleBlockAccount}
              disabled={actionLoading}
            >
              {actionLoading ? 'Processing...' : 'Block Account'}
            </Button>
          )}
        </Stack>
      </Box>

      <Grid container spacing={3}>
        {/* Personal Information */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} className="p-6 border border-gray-100">
            <Box className="flex items-center mb-4">
              <PersonIcon sx={{ color: '#2b5876', mr: 1 }} />
              <Typography variant="h6" className="font-semibold">
                Personal Information
              </Typography>
            </Box>
            <Divider className="mb-4" />
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Name
                </Typography>
                <Typography variant="body1">{seller.name}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  <EmailIcon sx={{ fontSize: 16, mr: 0.5 }} />
                  Email
                </Typography>
                <Typography variant="body1">{seller.email}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  <PhoneIcon sx={{ fontSize: 16, mr: 0.5 }} />
                  Phone
                </Typography>
                <Typography variant="body1">{seller.phone}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  <ScheduleIcon sx={{ fontSize: 16, mr: 0.5 }} />
                  Joined Date
                </Typography>
                <Typography variant="body1">
                  {new Date(seller.createdAt).toLocaleDateString()}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Business Details */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} className="p-6 border border-gray-100">
            <Box className="flex items-center mb-4">
              <BusinessIcon sx={{ color: '#2b5876', mr: 1 }} />
              <Typography variant="h6" className="font-semibold">
                Business Details
              </Typography>
            </Box>
            <Divider className="mb-4" />
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Business Name
                </Typography>
                <Typography variant="body1">
                  {businessDetails?.business_name || 'Not provided'}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  <LocationIcon sx={{ fontSize: 16, mr: 0.5 }} />
                  Address
                </Typography>
                <Typography variant="body1">
                  {businessDetails?.business_address || 'Not provided'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Pincode
                </Typography>
                <Typography variant="body1">
                  {businessDetails?.pincode || 'Not provided'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  PAN
                </Typography>
                <Typography variant="body1">
                  {businessDetails?.documents?.pan || 'Not provided'}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Bank Details */}
        <Grid item xs={12}>
          <Paper elevation={0} className="p-6 border border-gray-100">
            <Box className="flex items-center mb-4">
              <AccountBalanceIcon sx={{ color: '#2b5876', mr: 1 }} />
              <Typography variant="h6" className="font-semibold">
                Bank Details
              </Typography>
            </Box>
            <Divider className="mb-4" />
            {bankDetails && bankDetails.length > 0 ? (
              bankDetails.map((bank, index) => (
                <Box key={bank._id} className={index > 0 ? 'mt-4' : ''}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Account Holder Name
                      </Typography>
                      <Typography variant="body1">
                        {bank.account_holder_name}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Account Number
                      </Typography>
                      <Typography variant="body1">
                        {bank.account_number}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        IFSC Code
                      </Typography>
                      <Typography variant="body1">{bank.ifsc_code}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Status
                      </Typography>
                      <Chip
                        label={bank.is_verified ? 'Verified' : 'Unverified'}
                        color={bank.is_verified ? 'success' : 'warning'}
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </Box>
              ))
            ) : (
              <Typography variant="body1" color="text.secondary">
                No bank details available
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
} 