'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleMap, Marker, Circle, InfoWindow } from '@react-google-maps/api';
import { Box, Button, Typography } from '@mui/material';

const mapContainerStyle = {
  width: '100%',
  height: 'calc(100vh - 64px)', // Full height minus header
};

const defaultCenter = {
  lat: 26.8737, // Centered on Jaipur
  lng: 75.7278,
};

export default function MapComponent({ sellers, drivers }) {
  const router = useRouter();
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);

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

  return (
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
                path: 'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z',
                fillColor: '#8B5CF6',
                fillOpacity: 1,
                strokeWeight: 1,
                strokeColor: '#6D28D9',
                scale: 1.5,
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
                </Box>
              </InfoWindow>
            )}
          </div>
        );
      })}
    </GoogleMap>
  );
} 