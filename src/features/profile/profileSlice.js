import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchUserProfile = createAsyncThunk(
  'profile/fetchUserProfile',
  async (_, { getState, rejectWithValue }) => {
    try {
      // Add a small delay to ensure token is properly stored
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const token = localStorage.getItem('access_token');
      if (!token) {
        return rejectWithValue('No authentication token found');
      }
      
      // Use your API service with proper authorization
      const response = await api.get('/api/accounts/profile/');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch profile');
    }
  }
);

export const fetchFarmerProfile = createAsyncThunk(
  'profile/fetchFarmerProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/accounts/farmer-profile/');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchBuyerProfile = createAsyncThunk(
  'profile/fetchBuyerProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/accounts/buyer-profile/');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async ({ profileType, profileData }, { rejectWithValue }) => {
    let endpoint;
    
    switch (profileType) {
      case 'user':
        endpoint = '/api/accounts/profile/';
        break;
      case 'farmer':
        endpoint = '/api/accounts/farmer-profile/';
        break;
      case 'buyer':
        endpoint = '/api/accounts/buyer-profile/';
        break;
      default:
        return rejectWithValue('Invalid profile type');
    }
    
    try {
      const response = await api.patch(endpoint, profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    userProfile: null,
    farmerProfile: null,
    buyerProfile: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearProfileError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // User Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userProfile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch user profile';
      })
      
      // Farmer Profile
      .addCase(fetchFarmerProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFarmerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.farmerProfile = action.payload;
      })
      .addCase(fetchFarmerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch farmer profile';
      })
      
      // Buyer Profile
      .addCase(fetchBuyerProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBuyerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.buyerProfile = action.payload;
      })
      .addCase(fetchBuyerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch buyer profile';
      })
      
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        if (action.meta.arg.profileType === 'user') {
          state.userProfile = action.payload;
        } else if (action.meta.arg.profileType === 'farmer') {
          state.farmerProfile = action.payload;
        } else if (action.meta.arg.profileType === 'buyer') {
          state.buyerProfile = action.payload;
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update profile';
      });
  }
});

export const { clearProfileError } = profileSlice.actions;
export default profileSlice.reducer;