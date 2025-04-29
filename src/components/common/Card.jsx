import React from 'react';
import { 
  Card as MuiCard,
  CardHeader,
  CardContent,
  CardActions,
  CardMedia,
  Typography,
  Box
} from '@mui/material';

/**
 * Enhanced Card component built on Material UI Card
 */
const Card = ({
  title,
  subheader,
  children,
  image,
  imageHeight = 140,
  imageAlt = 'card image',
  actions,
  elevation = 1,
  onClick,
  sx = {},
  headerProps = {},
  contentProps = {},
  actionsProps = {},
  ...props
}) => {
  return (
    <MuiCard 
      elevation={elevation} 
      onClick={onClick}
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: onClick ? 'pointer' : 'default',
        ...sx
      }}
      {...props}
    >
      {(title || subheader) && (
        <CardHeader 
          title={title} 
          subheader={subheader} 
          {...headerProps}
        />
      )}
      
      {image && (
        <CardMedia
          component="img"
          height={imageHeight}
          image={image}
          alt={imageAlt}
        />
      )}
      
      <CardContent sx={{ flexGrow: 1, ...contentProps.sx }}>
        {typeof children === 'string' ? (
          <Typography variant="body2">{children}</Typography>
        ) : (
          children
        )}
      </CardContent>
      
      {actions && (
        <CardActions sx={{ padding: 2, ...actionsProps.sx }}>
          {actions}
        </CardActions>
      )}
    </MuiCard>
  );
};

export default Card;