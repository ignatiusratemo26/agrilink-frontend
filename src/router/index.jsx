import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';

// Common components
import Loader from '../components/common/Loader';

// Auth Pages
const Login = lazy(() => import('../pages/Auth/Login'));
const Register = lazy(() => import('../pages/Auth/Register'));
const ForgotPassword = lazy(() => import('../pages/Auth/ForgotPassword'));

// Dashboard Pages
const FarmerDashboard = lazy(() => import('../pages/Dashboard/FarmerDashboard'));
const BuyerDashboard = lazy(() => import('../pages/Dashboard/BuyerDashboard'));
const AdminDashboard = lazy(() => import('../pages/Dashboard/AdminDashboard'));

// Marketplace Pages
const Products = lazy(() => import('../pages/Marketplace/Products'));
const ProductDetail = lazy(() => import('../pages/Marketplace/ProductDetail'));
const CreateProduct = lazy(() => import('../pages/Marketplace/CreateProduct'));
const Orders = lazy(() => import('../pages/Marketplace/Orders'));

// Recommendations Pages
const SoilData = lazy(() => import('../pages/Recommendations/SoilData'));
const Recommendations = lazy(() => import('../pages/Recommendations/Recommendations'));

// Community Pages
const Forums = lazy(() => import('../pages/Community/Forums'));
const ForumThread = lazy(() => import('../pages/Community/ForumThread'));

// Learning Pages
const Courses = lazy(() => import('../pages/Learning/Courses'));
const CourseDetail = lazy(() => import('../pages/Learning/CourseDetail'));

// Profile Pages
const FarmerProfile = lazy(() => import('../pages/Profile/FarmerProfile'));
const BuyerProfile = lazy(() => import('../pages/Profile/BuyerProfile'));

// Other Pages
const Home = lazy(() => import('../pages/Home'));
const NotFound = lazy(() => import('../pages/NotFound'));

// Auth guard component
const RequireAuth = ({ children }) => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Dashboard resolver based on user type
const DashboardResolver = () => {
  const userType = localStorage.getItem('user_type') || 
                   JSON.parse(atob(localStorage.getItem('access_token')?.split('.')[1] || 'e30='))?.user_type;
  
  switch(userType) {
    case 'farmer':
      return <Navigate to="/dashboard/farmer" replace />;
    case 'buyer':
      return <Navigate to="/dashboard/buyer" replace />;
    case 'admin':
      return <Navigate to="/dashboard/admin" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

// Profile resolver based on user type
const ProfileResolver = () => {
  const userType = localStorage.getItem('user_type') || 
                   JSON.parse(atob(localStorage.getItem('access_token')?.split('.')[1] || 'e30='))?.user_type;
  
  switch(userType) {
    case 'farmer':
      return <Navigate to="/profile/farmer" replace />;
    case 'buyer':
      return <Navigate to="/profile/buyer" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

// Wrap components with Suspense for lazy loading
const withSuspense = (Component) => (
  <Suspense fallback={<Loader />}>
    <Component />
  </Suspense>
);

const router = createBrowserRouter([
  // Public routes
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: withSuspense(Login) },
      { path: '/register', element: withSuspense(Register) },
      { path: '/forgot-password', element: withSuspense(ForgotPassword) },
    ],
  },
  
  // Protected routes
  {
    element: <RequireAuth><MainLayout /></RequireAuth>,
    children: [
      { path: '/', element: <DashboardResolver /> },
      {
        path: '/dashboard',
        element: <DashboardResolver />,
      },
      {
        path: '/dashboard/farmer',
        element: withSuspense(FarmerDashboard),
      },
      {
        path: '/dashboard/buyer',
        element: withSuspense(BuyerDashboard),
      },
      {
        path: '/dashboard/admin',
        element: withSuspense(AdminDashboard),
      },
      {
        path: '/profile',
        element: <ProfileResolver />,
      },
      {
        path: '/profile/farmer',
        element: withSuspense(FarmerProfile),
      },
      {
        path: '/profile/buyer',
        element: withSuspense(BuyerProfile),
      },
      {
        path: '/marketplace',
        element: withSuspense(Products),
      },
      {
        path: '/marketplace/product/:id',
        element: withSuspense(ProductDetail),
      },
      {
        path: '/marketplace/create',
        element: withSuspense(CreateProduct),
      },
      {
        path: '/marketplace/orders',
        element: withSuspense(Orders),
      },
      {
        path: '/recommendations',
        element: withSuspense(SoilData),
      },
      {
        path: '/recommendations/results',
        element: withSuspense(Recommendations),
      },
      {
        path: '/community',
        element: withSuspense(Forums),
      },
      {
        path: '/community/thread/:id',
        element: withSuspense(ForumThread),
      },
      {
        path: '/learning',
        element: withSuspense(Courses),
      },
      {
        path: '/learning/course/:id',
        element: withSuspense(CourseDetail),
      },
    ],
  },
  
  // Fallback route
  {
    path: '*',
    element: withSuspense(NotFound),
  },
]);

export default router;