import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchContractRequests = createAsyncThunk(
  'contracts/fetchContractRequests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/connections/contract-requests/');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createContractRequest = createAsyncThunk(
  'contracts/createContractRequest',
  async (contractData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/connections/contract-requests/', contractData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchFarmerOffers = createAsyncThunk(
  'contracts/fetchFarmerOffers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/connections/farmer-offers/');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createFarmerOffer = createAsyncThunk(
  'contracts/createFarmerOffer',
  async (offerData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/connections/farmer-offers/', offerData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const contractsSlice = createSlice({
  name: 'contracts',
  initialState: {
    contractRequests: [],
    farmerOffers: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearContractsError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Contract Requests
      .addCase(fetchContractRequests.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchContractRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.contractRequests = action.payload;
      })
      .addCase(fetchContractRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch contract requests';
      })
      
      // Create Contract Request
      .addCase(createContractRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(createContractRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.contractRequests = [...state.contractRequests, action.payload];
      })
      .addCase(createContractRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create contract request';
      })
      
      // Fetch Farmer Offers
      .addCase(fetchFarmerOffers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFarmerOffers.fulfilled, (state, action) => {
        state.loading = false;
        state.farmerOffers = action.payload;
      })
      .addCase(fetchFarmerOffers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch farmer offers';
      })
      
      // Create Farmer Offer
      .addCase(createFarmerOffer.pending, (state) => {
        state.loading = true;
      })
      .addCase(createFarmerOffer.fulfilled, (state, action) => {
        state.loading = false;
        state.farmerOffers = [...state.farmerOffers, action.payload];
      })
      .addCase(createFarmerOffer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create farmer offer';
      });
  }
});

export const { clearContractsError } = contractsSlice.actions;
export default contractsSlice.reducer;