import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import StorefrontIcon from '@mui/icons-material/Storefront';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Mock data for demonstration
const userStats = {
  total: 2458,
  farmers: 1856,
  buyers: 583,
  admins: 19,
  newThisMonth: 142
};

const salesData = [
  { month: 'Jan', sales: 4000 },
  { month: 'Feb', sales: 3000 },
  { month: 'Mar', sales: 5000 },
  { month: 'Apr', sales: 4800 },
  { month: 'May', sales: 6000 },
  { month: 'Jun', sales: 5500 },
  { month: 'Jul', sales: 7000 },
];

const userTypeData = [
  { name: 'Farmers', value: 1856, color: '#4CAF50' },
  { name: 'Buyers', value: 583, color: '#FF8F00' },
  { name: 'Admins', value: 19, color: '#1976D2' },
];

const recentUsers = [
  { id: 1, name: 'John Doe', type: 'farmer', joined: '2023-04-20' },
  { id: 2, name: 'Jane Smith', type: 'buyer', joined: '2023-04-19' },
  { id: 3, name: 'Mark Johnson', type: 'farmer', joined: '2023-04-18' },
  { id: 4, name: 'Sarah Williams', type: 'buyer', joined: '2023-04-17' },
];

const recentOrders = [
  { id: 1001, buyer: 'ABC Corp', amount: 5200.00, status: 'completed', date: '2023-04-20' },
  { id: 1002, buyer: 'XYZ Ltd', amount: 1750.50, status: 'processing', date: '2023-04-20' },
  { id: 1003, buyer: 'Fresh Foods', amount: 3600.75, status: 'pending', date: '2023-04-19' },
  { id: 1004, buyer: 'Green Harvest', amount: 2100.25, status: 'completed', date: '2023-04-18' },
];

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      {/* Statistics Overview */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                <PersonIcon />
              </Avatar>
              <Typography variant="h6">Users</Typography>
            </Box>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
              {userStats.total}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              +{userStats.newThisMonth} this month
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                <AgricultureIcon />
              </Avatar>
              <Typography variant="h6">Farmers</Typography>
            </Box>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
              {userStats.farmers}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {Math.round((userStats.farmers / userStats.total) * 100)}% of users
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                <StorefrontIcon />
              </Avatar>
              <Typography variant="h6">Buyers</Typography>
            </Box>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
              {userStats.buyers}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {Math.round((userStats.buyers / userStats.total) * 100)}% of users
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: 'error.main', mr: 2 }}>
                <AttachMoneyIcon />
              </Avatar>
              <Typography variant="h6">Revenue</Typography>
            </Box>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
              Ksh24,920
            </Typography>
            <Typography variant="body2" color="text.secondary">
              +12% since last month
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Sales Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 350 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Sales Overview</Typography>
              <Button startIcon={<DownloadIcon />} size="small">
                Export
              </Button>
            </Box>
            <ResponsiveContainer>
              <LineChart
                data={salesData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#4CAF50"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* User Distribution */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 350 }}>
            <Typography variant="h6" gutterBottom>
              User Distribution
            </Typography>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={userTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {userTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Recent Users */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recently Joined Users
              </Typography>
              <List>
                {recentUsers.map((user) => (
                  <React.Fragment key={user.id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: user.type === 'farmer' ? 'success.main' : 'warning.main' }}>
                          {user.type === 'farmer' ? <AgricultureIcon /> : <StorefrontIcon />}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={user.name}
                        secondary={`Joined on ${new Date(user.joined).toLocaleDateString()}`}
                      />
                      <Chip
                        label={user.type}
                        size="small"
                        color={user.type === 'farmer' ? 'success' : 'warning'}
                      />
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                onClick={() => navigate('/admin/users')}
              >
                View All Users
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Recent Orders */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Orders
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Order ID</TableCell>
                      <TableCell>Buyer</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>#{order.id}</TableCell>
                        <TableCell>{order.buyer}</TableCell>
                        <TableCell align="right">${order.amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Chip
                            label={order.status}
                            size="small"
                            color={
                              order.status === 'completed' ? 'success' :
                                order.status === 'processing' ? 'info' : 'default'
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                onClick={() => navigate('/admin/orders')}
              >
                View All Orders
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Administrative Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<VerifiedUserIcon />}
                  sx={{ py: 1.5 }}
                  onClick={() => navigate('/admin/verification-requests')}
                >
                  Verification Requests
                </Button>
              </Grid>
              <Grid item xs={6} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  startIcon={<EditIcon />}
                  sx={{ py: 1.5 }}
                  onClick={() => navigate('/admin/content')}
                >
                  Manage Content
                </Button>
              </Grid>
              <Grid item xs={6} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  color="info"
                  startIcon={<ShoppingCartIcon />}
                  sx={{ py: 1.5 }}
                  onClick={() => navigate('/admin/products')}
                >
                  Review Products
                </Button>
              </Grid>
              <Grid item xs={6} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  color="warning"
                  startIcon={<DownloadIcon />}
                  sx={{ py: 1.5 }}
                  onClick={() => navigate('/admin/reports')}
                >
                  Generate Reports
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;