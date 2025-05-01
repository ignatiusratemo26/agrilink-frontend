import { useSelector, useDispatch } from 'react-redux';
import { loginUser, registerUser, logout } from '../features/auth/authSlice';
import { fetchUserProfile } from '../features/profile/profileSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, error, token, user } = useSelector((state) => state.auth);
  
  const profile = useSelector((state) => state.profile);
  const userProfile = profile ? profile.userProfile : null;

  const login = async (credentials) => {
    try {
      const resultAction = await dispatch(loginUser(credentials));
      
      if (loginUser.fulfilled.match(resultAction)) {
        console.log("Login successful:", resultAction.payload);
        
        // Wait for the user profile to be fetched before returning success
        try {
          await dispatch(fetchUserProfile()).unwrap();
        } catch (profileError) {
          console.warn("Profile fetch failed but login succeeded:", profileError);
          // Continue even if profile fetch fails - the user is still authenticated
        }
        
        return { success: true };
      } else {
        console.error("Login failed:", resultAction.error);
        return { 
          success: false, 
          error: resultAction.error?.message || 'Login failed' 
        };
      }
    } catch (err) {
      console.error("Login exception:", err);
      return { 
        success: false, 
        error: 'An unexpected error occurred' 
      };
    }
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