import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { isTokenExpired, removeTokens, storeTokens } from '../../utils/tokenHelpers';

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/accounts/register/', userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// export const loginUser = createAsyncThunk(
//   'auth/loginUser',
//   async (credentials, { rejectWithValue }) => {
//     try {
//       const response = await fetch(import.meta.env.VITE_API_URL +'/api/accounts/login/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(credentials),
//       });
      
//       const data = await response.json();
      
//       if (!response.ok) {
//         return rejectWithValue(data);
//       }
      
      
//       return data;
//     } catch (error) {
//       return rejectWithValue('Login failed. Server error.');
//     }
//   }
// );
// In the loginUser thunk, correct the token storage
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch(import.meta.env.VITE_API_URL + '/api/accounts/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return rejectWithValue(data);
      }
        // Store the tokens in localStorage - note the correct structure!
      if (data.tokens) {
        storeTokens(data.tokens.access, data.tokens.refresh);
        localStorage.setItem('user_type', data.user_type);
      }
      
      return data;
    } catch (error) {
      return rejectWithValue('Login failed. Server error.');
    }
  }
);



const accessToken = localStorage.getItem('access_token');
const refreshToken = localStorage.getItem('refresh_token');
const tokenValid = accessToken && !isTokenExpired();

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: tokenValid ? accessToken : null,
    refreshToken: tokenValid ? refreshToken : null,
    isAuthenticated: tokenValid,
    loading: false,
    error: null,
  },  reducers: {
    logout: (state) => {
      removeTokens();
      localStorage.removeItem('user_type');
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
    },
    checkTokenValidity: (state) => {
      const accessToken = localStorage.getItem('access_token');
      const tokenIsValid = accessToken && !isTokenExpired();
      state.isAuthenticated = tokenIsValid;
      state.token = tokenIsValid ? accessToken : null;
      state.refreshToken = tokenIsValid ? localStorage.getItem('refresh_token') : null;
      
      if (!tokenIsValid && state.token) {
        // If token exists but is invalid, clean up
        removeTokens();
        state.token = null;
        state.refreshToken = null;
      }
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.tokens.access;
        state.refreshToken = action.payload.tokens.refresh;
        state.userType = action.payload.user_type;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      });  },
});

export const { logout, checkTokenValidity, clearError } = authSlice.actions;
export default authSlice.reducer;