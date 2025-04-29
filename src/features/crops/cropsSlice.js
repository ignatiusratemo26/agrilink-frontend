import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchAllCrops = createAsyncThunk(
  'crops/fetchAllCrops',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/crops/crops/');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createSoilRecord = createAsyncThunk(
  'crops/createSoilRecord',
  async (soilData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/crops/soil-records/', soilData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchSoilRecords = createAsyncThunk(
  'crops/fetchSoilRecords',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/crops/soil-records/');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getCropRecommendation = createAsyncThunk(
  'crops/getCropRecommendation',
  async (soilData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/crops/recommendations/recommend/', soilData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const cropsSlice = createSlice({
  name: 'crops',
  initialState: {
    crops: [],
    soilRecords: [],
    recommendation: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCropsError: (state) => {
      state.error = null;
    },
    clearRecommendation: (state) => {
      state.recommendation = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Crops
      .addCase(fetchAllCrops.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllCrops.fulfilled, (state, action) => {
        state.loading = false;
        state.crops = action.payload;
      })
      .addCase(fetchAllCrops.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch crops';
      })
      
      // Create Soil Record
      .addCase(createSoilRecord.pending, (state) => {
        state.loading = true;
      })
      .addCase(createSoilRecord.fulfilled, (state, action) => {
        state.loading = false;
        state.soilRecords = [...state.soilRecords, action.payload];
      })
      .addCase(createSoilRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create soil record';
      })
      
      // Fetch Soil Records
      .addCase(fetchSoilRecords.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSoilRecords.fulfilled, (state, action) => {
        state.loading = false;
        state.soilRecords = action.payload;
      })
      .addCase(fetchSoilRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch soil records';
      })
      
      // Get Crop Recommendation
      .addCase(getCropRecommendation.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCropRecommendation.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendation = action.payload;
      })
      .addCase(getCropRecommendation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to get crop recommendation';
      });
  }
});

export const { clearCropsError, clearRecommendation } = cropsSlice.actions;
export default cropsSlice.reducer;