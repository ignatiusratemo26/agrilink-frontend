import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Paper,
  Grid,
  TextField,
  FormControlLabel,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Button,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useCreateProductMutation } from '../../features/marketplace/marketplaceApi';
import { useGetAllCropsQuery } from '../../features/crops/cropsApi';
import Loader from '../../components/common/Loader';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const CreateProduct = () => {
  const navigate = useNavigate();
  const [createProduct, { isLoading }] = useCreateProductMutation();
  const { data: crops, isLoading: cropsLoading } = useGetAllCropsQuery();
  const [imagePreview, setImagePreview] = useState(null);
  
  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    price_per_unit: Yup.number()
      .positive('Price must be positive')
      .required('Price is required'),
    unit: Yup.string().required('Unit is required'),
    quantity_available: Yup.number()
      .integer('Quantity must be a whole number')
      .positive('Quantity must be positive')
      .required('Quantity is required'),
    crop: Yup.number().required('Crop type is required')
  });
  
  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      price_per_unit: '',
      unit: 'kg',
      quantity_available: '',
      crop: '',
      organic: false,
      harvest_date: '',
      cultivation_method: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        // In a real app, we'd handle image upload separately
        const productData = {
          ...values,
          price_per_unit: parseFloat(values.price_per_unit),
          quantity_available: parseInt(values.quantity_available),
          // For demo purposes, include the image preview as a field
          // In a real app, you'd upload the image to a storage service
          image: imagePreview || 'https://via.placeholder.com/500x300?text=Product+Image'
        };
        
        const result = await createProduct(productData).unwrap();
        navigate(`/marketplace/product/${result.id}`);
      } catch (err) {
        console.error('Failed to create product:', err);
      }
    }
  });
  
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // In a real app, you'd upload this to cloud storage
      // For now, we'll just create a local object URL
      setImagePreview(URL.createObjectURL(file));
    }
  };
  
  if (cropsLoading) {
    return <Loader message="Loading crop data..." />;
  }
  
  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          List Your Product
        </Typography>
        
        <Typography variant="body1" paragraph sx={{ mb: 4 }}>
          Fill out the form below to list your agricultural product on the marketplace.
        </Typography>
        
        <Box component="form" onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="title"
                name="title"
                label="Product Title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
                disabled={isLoading}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={formik.touched.crop && Boolean(formik.errors.crop)}>
                <InputLabel>Crop Type</InputLabel>
                <Select
                  id="crop"
                  name="crop"
                  label="Crop Type"
                  value={formik.values.crop}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={isLoading}
                >
                  {crops?.map((crop) => (
                    <MenuItem key={crop.id} value={crop.id}>
                      {crop.name}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.crop && formik.errors.crop && (
                  <Typography color="error" variant="caption">{formik.errors.crop}</Typography>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                id="description"
                name="description"
                label="Product Description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
                disabled={isLoading}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                id="price_per_unit"
                name="price_per_unit"
                label="Price Per Unit"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                value={formik.values.price_per_unit}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.price_per_unit && Boolean(formik.errors.price_per_unit)}
                helperText={formik.touched.price_per_unit && formik.errors.price_per_unit}
                disabled={isLoading}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControl fullWidth error={formik.touched.unit && Boolean(formik.errors.unit)}>
                <InputLabel>Unit</InputLabel>
                <Select
                  id="unit"
                  name="unit"
                  label="Unit"
                  value={formik.values.unit}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={isLoading}
                >
                  <MenuItem value="kg">Kilogram (kg)</MenuItem>
                  <MenuItem value="g">Gram (g)</MenuItem>
                  <MenuItem value="ton">Metric Ton</MenuItem>
                  <MenuItem value="lb">Pound (lb)</MenuItem>
                  <MenuItem value="piece">Piece/Unit</MenuItem>
                  <MenuItem value="box">Box</MenuItem>
                  <MenuItem value="bag">Bag</MenuItem>
                </Select>
                {formik.touched.unit && formik.errors.unit && (
                  <Typography color="error" variant="caption">{formik.errors.unit}</Typography>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                id="quantity_available"
                name="quantity_available"
                label="Available Quantity"
                type="number"
                value={formik.values.quantity_available}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.quantity_available && Boolean(formik.errors.quantity_available)}
                helperText={formik.touched.quantity_available && formik.errors.quantity_available}
                disabled={isLoading}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="harvest_date"
                name="harvest_date"
                label="Harvest Date"
                type="date"
                value={formik.values.harvest_date}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                InputLabelProps={{ shrink: true }}
                disabled={isLoading}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="cultivation_method"
                name="cultivation_method"
                label="Cultivation Method"
                value={formik.values.cultivation_method}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isLoading}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    id="organic"
                    name="organic"
                    checked={formik.values.organic}
                    onChange={formik.handleChange}
                    disabled={isLoading}
                    color="primary"
                  />
                }
                label="Organic Product"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUploadIcon />}
                fullWidth
                sx={{ height: '120px', borderStyle: 'dashed' }}
              >
                {imagePreview ? 'Change Product Image' : 'Upload Product Image'}
                <input type="file" hidden accept="image/*" onChange={handleImageChange} />
              </Button>
              
              {imagePreview && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <img 
                    src={imagePreview} 
                    alt="Product preview" 
                    style={{ 
                      maxHeight: '150px',
                      maxWidth: '100%',
                      objectFit: 'contain'
                    }} 
                  />
                </Box>
              )}
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button 
              variant="outlined"
              onClick={() => navigate('/marketplace')}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'List Product'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateProduct;