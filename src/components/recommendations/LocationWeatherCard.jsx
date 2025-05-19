import React from 'react';
import {
  Box,
  Typography,
  Divider,
  Grid,
  Avatar
} from '@mui/material';
import Card from '../common/Card';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import GrainIcon from '@mui/icons-material/Grain';
import { formatSoilParameter } from '../../utils/formatters';

const LocationWeatherCard = ({ 
  location, 
  coordinates, 
  temperature, 
  rainfall,
  humidity
}) => {
  return (
    <Card
      elevation={2}
      title="Location & Weather"
      icon={<LocationOnIcon />}
      sx={{ height: '100%' }}
      headerProps={{
        titleTypographyProps: { variant: 'h6' },
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Grid container alignItems="center" spacing={1}>
          <Grid item>
            <Avatar 
              sx={{ 
                bgcolor: 'primary.main',
                width: 40,
                height: 40
              }}
            >
              <LocationOnIcon />
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="subtitle1">
              {location || 'Location not specified'}
            </Typography>
            {coordinates && coordinates.lat && coordinates.lng && (
              <Typography variant="body2" color="text.secondary">
                {coordinates.lat.toFixed(4)}°, {coordinates.lng.toFixed(4)}°
              </Typography>
            )}
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Climate Conditions
          </Typography>
        </Grid>
        
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <ThermostatIcon color="error" sx={{ mr: 1 }} />
            <Typography variant="body1">
              Temperature: {temperature ? `${temperature}°C` : 'Not available'}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <WaterDropIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="body1">
              Rainfall: {rainfall ? `${rainfall} mm` : 'Not available'}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <GrainIcon color="info" sx={{ mr: 1 }} />
            <Typography variant="body1">
              Humidity: {humidity ? `${humidity}%` : 'Not available'}
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
            Crop recommendations are based on these environmental conditions.
          </Typography>
        </Grid>
      </Grid>
    </Card>
  );
};

export default LocationWeatherCard;