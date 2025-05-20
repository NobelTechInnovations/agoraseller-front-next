'use client';

import { useState, useEffect, use } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Slider,
  TextField,
  CircularProgress,
  Stack,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import axiosInstance from '../../../../../utils/axios';
import { GoogleMap, LoadScript, Circle, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: 'calc(100vh - 200px)',
};

const defaultCenter = {
  lat: 20.5937, // India center latitude
  lng: 78.9629, // India center longitude
};

export default function ServiceableZonePage({ params }) {
  const router = useRouter();
  const sellerId = use(params).id;
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/admin/login');
    },
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sellers, setSellers] = useState([]);
  const [currentSeller, setCurrentSeller] = useState(null);
  const [center, setCenter] = useState(defaultCenter);
  const [radius, setRadius] = useState(5); // Default 5km radius
  const [searchAddress, setSearchAddress] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (status === 'authenticated' && session?.accessToken) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${session.accessToken}`;
      fetchSellers();
    }
  }, [status, session]);

  const fetchSellers = async () => {
    try {
      const response = await axiosInstance.get('/v1/admin/seller/zones');
      if (response.data.success) {
        setSellers(response.data.data.sellers);
        const current = response.data.data.sellers.find(s => s._id === sellerId);
        if (current) {
          setCurrentSeller(current);
          if (current.location?.coordinates) {
            setCenter({
              lat: current.location.coordinates[1],
              lng: current.location.coordinates[0],
            });
            setRadius(current.serviceableRadius || 5);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching sellers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveZone = async () => {
    try {
      setSaving(true);
      const response = await axiosInstance.post(`/v1/admin/seller/${sellerId}/zone`, {
        serviceableRadius: radius,
        coordinates: [center.lng, center.lat],
      });
      if (response.data.success) {
        router.back();
      }
    } catch (error) {
      console.error('Error saving zone:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddressSearch = async () => {
    try {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: searchAddress }, (results, status) => {
        if (status === 'OK') {
          const { lat, lng } = results[0].geometry.location;
          setCenter({ lat: lat(), lng: lng() });
        }
      });
    } catch (error) {
      console.error('Error searching address:', error);
    }
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
        <Stack direction="row" spacing={2} alignItems="center">
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
            Back
          </Button>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Serviceable Zone - {currentSeller?.business_name || currentSeller?.name}
          </Typography>
        </Stack>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSaveZone}
          disabled={saving}
          sx={{
            background: 'linear-gradient(135deg, #2b5876 0%, #4e4376 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #4e4376 0%, #2b5876 100%)',
            },
          }}
        >
          {saving ? 'Saving...' : 'Save Zone'}
        </Button>
      </Box>

      <Paper elevation={0} className="mb-6 p-4 border border-gray-100">
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            fullWidth
            placeholder="Search address..."
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
            size="small"
          />
          <Button
            variant="outlined"
            startIcon={<SearchIcon />}
            onClick={handleAddressSearch}
            sx={{
              borderColor: 'rgba(43, 88, 118, 0.5)',
              color: '#2b5876',
              '&:hover': {
                borderColor: '#2b5876',
                backgroundColor: 'rgba(43, 88, 118, 0.04)',
              },
            }}
          >
            Search
          </Button>
        </Stack>
      </Paper>

      <Paper elevation={0} className="mb-6 p-4 border border-gray-100">
        <Typography gutterBottom>Serviceable Radius (km)</Typography>
        <Slider
          value={radius}
          onChange={(e, newValue) => setRadius(newValue)}
          min={1}
          max={50}
          valueLabelDisplay="auto"
          sx={{
            '& .MuiSlider-thumb': {
              color: '#2b5876',
            },
            '& .MuiSlider-track': {
              color: '#2b5876',
            },
            '& .MuiSlider-rail': {
              color: '#4e4376',
            },
          }}
        />
      </Paper>

      <Paper elevation={0} className="border border-gray-100">
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={12}
            onClick={(e) => setCenter({ lat: e.latLng.lat(), lng: e.latLng.lng() })}
          >
            {/* Current seller's zone */}
            <Circle
              center={center}
              radius={radius * 1000} // Convert km to meters
              options={{
                fillColor: '#2b5876',
                fillOpacity: 0.2,
                strokeColor: '#2b5876',
                strokeOpacity: 0.8,
                strokeWeight: 2,
              }}
            />
            <Marker
              position={center}
              icon={{
                url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
              }}
            />

            {/* Other sellers */}
            {sellers
              .filter(s => s._id !== sellerId && s.location?.coordinates)
              .map(seller => (
                <Circle
                  key={seller._id}
                  center={{
                    lat: seller.location.coordinates[1],
                    lng: seller.location.coordinates[0],
                  }}
                  radius={(seller.serviceableRadius || 5) * 1000}
                  options={{
                    fillColor: '#4e4376',
                    fillOpacity: 0.1,
                    strokeColor: '#4e4376',
                    strokeOpacity: 0.5,
                    strokeWeight: 1,
                  }}
                />
              ))}
          </GoogleMap>
        </LoadScript>
      </Paper>
    </Box>
  );
} 