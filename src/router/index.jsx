import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
// Layouts
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';

// Common components
import Loader from '../components/common/Loader';
import Cart from '../pages/Marketplace/Cart';
import Checkout from '../pages/Marketplace/Checkout';

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

// Contracts Pages
const Contracts = lazy(() => import('../pages/Contracts/Contracts'));

// Community Pages
const Forums = lazy(() => import('../pages/Community/Forums'));
const DiscussionDetail = lazy(() => import('../pages/Community/DiscussionDetail'));

// Learning Pages
const Courses = lazy(() => import('../pages/Learning/Courses'));
const CourseDetail = lazy(() => import('../pages/Learning/CourseDetail'));

// Profile Pages
const UserProfile = lazy(() => import('../pages/Profile/UserProfile'));
const FarmerProfile = lazy(() => import('../pages/Profile/FarmerProfile'));
const BuyerProfile = lazy(() => import('../pages/Profile/BuyerProfile'));

// Other Pages
const Home = lazy(() => import('../pages/Home'));
const NotFound = lazy(() => import('../pages/NotFound'));

// Auth guard component
const RequireAuth = ({ children }) => {
  const { isAuthenticated } = useSelector(state => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Dashboard resolver based on user type
const DashboardResolver = () => {
  // Get auth state from Redux
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const userProfile = useSelector(state => state.profile?.userProfile);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Get user type from profile or user object
  const userType = localStorage.getItem('user_type') || 
                  useSelector(state => state.auth.userType);

  // Redirect based on user type
  switch (userType) {
    case 'farmer':
      return <Navigate to="/dashboard/farmer" replace />;
    case 'buyer':
      return <Navigate to="/dashboard/buyer" replace />;
    case 'admin':
      return <Navigate to="/dashboard/admin" replace />;
    default:
      return <Navigate to="/dashboard/farmer" replace />;
  }
};

const ProfileResolver = () => {
  // Try to get the user type from various sources
  const userType = localStorage.getItem('user_type') || 
                   JSON.parse(atob(localStorage.getItem('access_token')?.split('.')[1] || 'e30='))?.user_type;
  
  switch(userType) {
    case 'farmer':
      return <Navigate to="/profile/farmer" replace />;
    case 'buyer':
      return <Navigate to="/profile/buyer" replace />;
    default:
      // Instead of redirecting to login, render the UserProfile component
      // which lets users choose which profile type to view
      return <Navigate to="/profile/select" replace />;
  }
};

// Wrap components with Suspense for lazy loading
// const withSuspense = (Component) => (
//   <Suspense fallback={<Loader />}>
//     <Component />
//   </Suspense>
// );
const withSuspense = (Component) => {
  const SuspenseWrapped = () => (
    <Suspense fallback={<Loader />}>
      <Component />
    </Suspense>
  );
  return <SuspenseWrapped />;
};

const router = createBrowserRouter([
  // Public routes
  {
    element: <MainLayout />,
    children: [
      { path: '/', element: withSuspense(Home) },
    ]
  },
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
        path: '/profile/select',
        element: withSuspense(UserProfile),
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
        path: '/marketplace/checkout',
        element: withSuspense(Checkout),
      },
      {
        path: '/marketplace/cart',
        element: withSuspense(Cart),
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
        path: '/contracts',
        element: withSuspense(Contracts),
      },      {
        path: '/community',
        element: withSuspense(Forums),
      },
      {
        path: '/community/discussion/:id',
        element: withSuspense(DiscussionDetail),
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