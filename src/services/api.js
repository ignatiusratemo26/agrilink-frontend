import axios from './axios';

const api = {
  // Auth endpoints
  auth: {
    register: (userData) => axios.post('/api/accounts/register/', userData),
    login: (credentials) => axios.post('/api/token/', credentials),
    refreshToken: (refreshToken) => axios.post('/api/token/refresh/', { refresh: refreshToken }),
  },
  
  // User profiles
  profiles: {
    getUserProfile: () => axios.get('/api/accounts/profile/'),
    updateUserProfile: (data) => axios.patch('/api/accounts/profile/', data),
    getFarmerProfile: () => axios.get('/api/accounts/farmer-profile/'),
    updateFarmerProfile: (data) => axios.patch('/api/accounts/farmer-profile/', data),
    getBuyerProfile: () => axios.get('/api/accounts/buyer-profile/'),
    updateBuyerProfile: (data) => axios.patch('/api/accounts/buyer-profile/', data),
  },
  
  // Crops and soil data
  crops: {
    getAllCrops: () => axios.get('/api/crops/crops/'),
    getSoilRecords: () => axios.get('/api/crops/soil-records/'),
    createSoilRecord: (data) => axios.post('/api/crops/soil-records/', data),
    getCropRecommendation: (data) => axios.post('/api/crops/recommendations/recommend/', data),
  },
  
  // Marketplace
  marketplace: {
    getProducts: () => axios.get('/api/marketplace/products/'),
    createProduct: (data) => axios.post('/api/marketplace/products/', data),
    getOrders: () => axios.get('/api/marketplace/orders/'),
    createOrder: (data) => axios.post('/api/marketplace/orders/', data),
  },
  
  // Connections
  connections: {
    getContractRequests: () => axios.get('/api/connections/contract-requests/'),
    createContractRequest: (data) => axios.post('/api/connections/contract-requests/', data),
    getFarmerOffers: () => axios.get('/api/connections/farmer-offers/'),
    createFarmerOffer: (data) => axios.post('/api/connections/farmer-offers/', data),
    getMessages: () => axios.get('/api/connections/messages/'),
    sendMessage: (data) => axios.post('/api/connections/messages/', data),
  },
};

export default api;