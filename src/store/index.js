import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { errorMiddleware } from './middleware';
import authReducer from '../features/auth/authSlice';
import { authApi } from '../features/auth/authApi';
import { profileApi } from '../features/profile/profileApi';
import { cropsApi } from '../features/crops/cropsApi';
import { marketplaceApi } from '../features/marketplace/marketplaceApi';
import { contractsApi } from '../features/contracts/contractsApi';
import { messagesApi } from '../features/messages/messagesApi';
import { communityApi } from '../features/community/communityApi';
import { learningApi } from '../features/learning/learningApi';

// Configure the Redux store
const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [cropsApi.reducerPath]: cropsApi.reducer,
    [marketplaceApi.reducerPath]: marketplaceApi.reducer,
    [contractsApi.reducerPath]: contractsApi.reducer,
    [messagesApi.reducerPath]: messagesApi.reducer,
    [communityApi.reducerPath]: communityApi.reducer,
    [learningApi.reducerPath]: learningApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(profileApi.middleware)
      .concat(cropsApi.middleware)
      .concat(marketplaceApi.middleware)
      .concat(contractsApi.middleware)
      .concat(messagesApi.middleware)
      .concat(communityApi.middleware)
      .concat(learningApi.middleware)
      .concat(errorMiddleware),
});

// Set up listeners for RTK Query
setupListeners(store.dispatch);

export default store;