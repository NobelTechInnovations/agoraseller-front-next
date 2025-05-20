'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { LoadScript, GoogleMap, Marker, Circle, InfoWindow } from '@react-google-maps/api';
import axiosInstance from '../../../../utils/axios';


const mapContainerStyle = {
  width: '100%',
  height: 'calc(100vh - 64px)', // Full height minus header
};

const defaultCenter = {
  lat: 26.8737, // Centered on Jaipur
  lng: 75.7278,
};

const libraries = ['places'];

// Bike icon SVG path (more accurate motorcycle/scooter shape)
const bikeIconPath = "M19 15.6c-1 0-1.8.8-1.8 1.8S18 19.2 19 19.2s1.8-.8 1.8-1.8-.8-1.8-1.8-1.8zm-6.3-2.7L8.4 7.6 6.3 7l-1.5 3.8h2.5l.6-1.5 1.5 2.1c-.7.8-1.2 1.9-1.2 3 0 1 .3 1.9.9 2.6l-1.5 1.5c-.1.1-.2.3-.2.5s.1.4.2.5c.1.1.3.2.5.2s.4-.1.5-.2l1.5-1.5c.7.5 1.6.9 2.6.9 2.4 0 4.3-1.9 4.3-4.3 0-1.4-.6-2.6-1.7-3.4zM5 15.6c-1 0-1.8.8-1.8 1.8S4 19.2 5 19.2s1.8-.8 1.8-1.8S6 15.6 5 15.6zm7.2 0c-1 0-1.8.8-1.8 1.8s.8 1.8 1.8 1.8 1.8-.8 1.8-1.8-.8-1.8-1.8-1.8z";

export default function SellersMapPage() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/admin/login');
    },
  });
  
  const [sellers, setSellers] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);

  useEffect(() => {
    if (status === 'authenticated' && session?.accessToken) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${session.accessToken}`;
      
      // Initial fetch
      fetchSellers();
      fetchDriverLocations();

      // Set up interval to fetch driver locations every minute
      const intervalId = setInterval(() => {
        console.log('Fetching driver locations...'); // Debug log
        fetchDriverLocations();
      }, 60000);

      // Cleanup interval on component unmount
      return () => {
        console.log('Cleaning up interval...'); // Debug log
        clearInterval(intervalId);
      };
    }
  }, [status, session]);

  // Handle browser back button
  useEffect(() => {
    const handlePopState = () => {
      router.push('/admin/dashboard/sellers');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [router]);

  const fetchDriverLocations = async () => {
    try {
      const response = await fetch('https://delivery-app-api-production.up.railway.app/api/admin/all-drivers-location');
      const data = await response.json();
      if (data.success) {
        console.log('Updated driver locations:', data.drivers.length); // Debug log
        setDrivers(data.drivers);
      }
    } catch (error) {
      console.error('Error fetching driver locations:', error);
    }
  };

  const fetchSellers = async () => {
    try {
      const response = await axiosInstance.get('/v1/admin/seller?limit=100');
      if (response.data.success) {
        setSellers(response.data.data.sellers);
      }
    } catch (error) {
      console.error('Error fetching sellers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkerClick = (seller) => {
    setSelectedSeller(seller);
    setSelectedDriver(null);
  };

  const handleDriverMarkerClick = (driver) => {
    setSelectedDriver(driver);
    setSelectedSeller(null);
  };

  const handleInfoWindowClose = () => {
    setSelectedSeller(null);
    setSelectedDriver(null);
  };

  const handleBackClick = () => {
    router.push('/admin/dashboard/sellers');
  };

  if (loading) {
    return (
      <Box className="flex items-center justify-center min-h-screen">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box className="flex items-center justify-between p-4 border-b">
        <Box className="flex items-center gap-4">
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBackClick}
            sx={{
              color: '#2b5876',
              '&:hover': {
                backgroundColor: 'rgba(43, 88, 118, 0.04)',
              },
            }}
          >
            Back
          </Button>
          <Typography variant="h6" className="font-semibold">
            Serviceable Zones
          </Typography>
          <Box className="flex gap-2">
            <Typography
              variant="body2"
              sx={{
                backgroundColor: 'rgba(43, 88, 118, 0.1)',
                color: '#2b5876',
                px: 2,
                py: 0.5,
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              Total Sellers: {sellers.filter(seller => seller.location?.coordinates && seller.location.coordinates[0] !== 0).length}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                color: '#8B5CF6',
                px: 2,
                py: 0.5,
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              Active Drivers: {drivers.length}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Map */}
      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY} libraries={libraries}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={defaultCenter}
          zoom={11}
          options={{
            mapTypeControl: true,
            streetViewControl: true,
            fullscreenControl: true,
          }}
        >
          {sellers.map((seller) => {
            if (seller.location?.coordinates && seller.location.coordinates[0] !== 0) {
              const position = {
                lat: seller.location.coordinates[1],
                lng: seller.location.coordinates[0],
              };
              
              return (
                <div key={seller._id}>
                  <Marker
                    position={position}
                    title={seller.name}
                    onClick={() => handleMarkerClick(seller)}
                  />
                  {selectedSeller?._id === seller._id && (
                    <InfoWindow
                      position={position}
                      onCloseClick={handleInfoWindowClose}
                    >
                      <Box className="p-1">
                        <Typography variant="subtitle2" className="font-semibold">
                          {seller.name}
                        </Typography>
                        <Typography variant="caption" className="text-gray-600 block">
                          {seller.business_address}
                        </Typography>
                        <Button
                          size="small"
                          onClick={() => router.push(`/admin/dashboard/sellers/${seller._id}`)}
                          sx={{
                            mt: 1,
                            fontSize: '0.75rem',
                            color: '#2b5876',
                            '&:hover': {
                              backgroundColor: 'rgba(43, 88, 118, 0.04)',
                            },
                          }}
                        >
                          View Details
                        </Button>
                      </Box>
                    </InfoWindow>
                  )}
                  <Circle
                    center={position}
                    radius={5000} // 5km in meters
                    options={{
                      fillColor: '#2b5876',
                      fillOpacity: 0.1,
                      strokeColor: '#2b5876',
                      strokeOpacity: 0.8,
                      strokeWeight: 1,
                    }}
                  />
                </div>
              );
            }
            return null;
          })}

          {/* Driver Markers */}
          {drivers.map((driver) => {
            const position = {
              lat: driver.latitude,
              lng: driver.longitude,
            };
            
            return (
              <div key={driver.driverId}>
                <Marker
                  position={position}
                  icon={{
                    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                    fillColor: '#4a148c',
                    fillOpacity: 1,
                    strokeWeight: 2,
                    strokeColor: '#4a148c',
                    scale: 8
                  }}
                  onClick={() => handleDriverMarkerClick(driver)}
                />
                {selectedDriver?.driverId === driver.driverId && (
                  <InfoWindow
                    position={position}
                    onCloseClick={handleInfoWindowClose}
                  >
                    <Box className="p-1">
                      <Typography variant="subtitle2" className="font-semibold">
                        Driver Details
                      </Typography>
                      <Typography variant="caption" className="text-gray-600 block">
                        Vehicle: {driver.vehicleNumber}
                      </Typography>
                      <Typography variant="caption" className="text-gray-600 block">
                        Type: {driver.vehicleType}
                      </Typography>
                      <Typography variant="caption" className="text-gray-600 block">
                        Phone: {driver.phone}
                      </Typography>
                      <Typography variant="caption" className="text-gray-600 block">
                        Last Updated: {new Date(driver.updatedAt).toLocaleTimeString()}
                      </Typography>
                    </Box>
                  </InfoWindow>
                )}
              </div>
            );
          })}
        </GoogleMap>
      </LoadScript>
    </Box>
  );
} 