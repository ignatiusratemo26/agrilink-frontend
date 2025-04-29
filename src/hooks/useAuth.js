import { useSelector, useDispatch } from 'react-redux';
import { loginUser, registerUser, logout } from '../features/auth/authSlice';
import { fetchUserProfile } from '../features/profile/profileSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, error, token, user } = useSelector((state) => state.auth);
  
  // Fix: Add a null check to prevent the TypeError
  const profile = useSelector((state) => state.profile);
  const userProfile = profile ? profile.userProfile : null;

  const login = async (credentials) => {
    const resultAction = await dispatch(loginUser(credentials));
    if (loginUser.fulfilled.match(resultAction)) {
      await dispatch(fetchUserProfile());
      return true;
    }
    return false;
  };

  const register = async (userData) => {
    const resultAction = await dispatch(registerUser(userData));
    return registerUser.fulfilled.match(resultAction);
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  return {
    isAuthenticated,
    loading,
    error,
    token,
    user,
    userProfile,
    login,
    register,
    logout: logoutUser,
  };
};

export default useAuth;