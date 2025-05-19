import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Button
} from '@mui/material';
import Card from '../common/Card';
import HistoryIcon from '@mui/icons-material/History';
import GrassIcon from '@mui/icons-material/Grass';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useGetSoilRecordsQuery } from '../../features/recommendations/recommendationsApi';

const RecommendationHistoryCard = () => {
  const navigate = useNavigate();
  const { data: soilRecords = [], isLoading } = useGetSoilRecordsQuery();
  
  // Sort records by date (newest first)
  const sortedRecords = [...(soilRecords || [])].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  ).slice(0, 5); // Show only latest 5
  
  return (
    <Card
      elevation={2}
      title="Previous Soil Analysis"
      icon={<HistoryIcon />}
      sx={{ height: '100%' }}
      headerProps={{
        titleTypographyProps: { variant: 'h6' },
      }}
      actions={
        <Button 
          variant="text" 
          color="primary" 
          size="small"
          onClick={() => navigate('/recommendations/soil-data')}
        >
          View All
        </Button>
      }
    >
      {isLoading ? (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Loading previous analyses...
          </Typography>
        </Box>
      ) : sortedRecords.length > 0 ? (
        <List sx={{ p: 0 }}>
          {sortedRecords.map((record, index) => (
            <React.Fragment key={record.id}>
              <ListItem 
                alignItems="flex-start" 
                button
                onClick={() => navigate('/recommendations/soil-data', { state: { editRecord: record }})}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <GrassIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={record.location_name}
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="text.primary">
                        N: {record.nitrogen}, P: {record.phosphorus}, K: {record.potassium}
                      </Typography>
                      <br />
                      <Typography component="span" variant="caption" color="text.secondary">
                        {format(new Date(record.created_at), 'MMM dd, yyyy')}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              {index < sortedRecords.length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            No previous soil analyses found. Create a new one to get crop recommendations.
          </Typography>
          <Button 
            variant="outlined" 
            color="primary" 
            size="small" 
            onClick={() => navigate('/recommendations/soil-data')}
            sx={{ mt: 2 }}
          >
            Create New Analysis
          </Button>
        </Box>
      )}
    </Card>
  );
};

export default RecommendationHistoryCard;