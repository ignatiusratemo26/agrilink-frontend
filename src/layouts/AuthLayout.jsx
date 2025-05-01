// import React from 'react';
// import { Outlet } from 'react-router-dom';
// import { Box, Container, Paper, Typography } from '@mui/material';
// import { Link } from 'react-router-dom';

// const AuthLayout = () => {
//   return (
//     <Box 
//       sx={{
//         minHeight: '100vh',
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         py: 6,
//         backgroundImage: 'linear-gradient(to bottom, #e8f5e9, #c8e6c9)',
//       }}
//     >
//       <Container maxWidth="xs" sx={{ mb: 4 }}>
//         <Box 
//           sx={{ 
//             display: 'flex', 
//             flexDirection: 'column', 
//             alignItems: 'center',
//             mb: 4
//           }}
//         >
//           <Typography 
//             component={Link} 
//             to="/"
//             variant="h3" 
//             color="primary" 
//             sx={{ fontWeight: 700, textDecoration: 'none' }}
//           >
//             AgriLink
//           </Typography>
//           <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
//             Intelligent Crop Recommendation & Farmer Empowerment
//           </Typography>
//         </Box>
        
//         <Paper 
//           elevation={3} 
//           sx={{ 
//             p: 4, 
//             display: 'flex', 
//             flexDirection: 'column',
//             borderRadius: 2
//           }}
//         >
//           <Outlet />
//         </Paper>
//       </Container>
      
//       <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
//         © {new Date().getFullYear()} AgriLink. All rights reserved.
//       </Typography>
//     </Box>
//   );
// };

// export default AuthLayout;

import React from 'react';
import { Outlet, Link as RouterLink } from 'react-router-dom';
import { Box, Container, Paper, Typography } from '@mui/material';

const AuthLayout = () => {
  return (
    <Box 
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 6,
        backgroundImage: 'linear-gradient(to bottom, #e8f5e9, #c8e6c9)',
      }}
    >
      <Container maxWidth="xs" sx={{ mb: 4 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            mb: 4
          }}
        >
          <Typography 
            component={RouterLink} 
            to="/"
            variant="h3" 
            color="primary" 
            sx={{ fontWeight: 700, textDecoration: 'none' }}
          >
            AgriLink
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Intelligent Crop Recommendation & Farmer Empowerment
          </Typography>
        </Box>
        
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            display: 'flex', 
            flexDirection: 'column',
            borderRadius: 2
          }}
        >
          <Outlet />
        </Paper>
      </Container>
      
      <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
        © {new Date().getFullYear()} AgriLink. All rights reserved.
      </Typography>
    </Box>
  );
};

export default AuthLayout;