/**
 * Email validation
 * @param {string} email - The email to validate
 * @returns {boolean} - True if valid, false if not
 */
export const isValidEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };
  
  /**
   * Password validation - minimum 8 chars, at least one letter and number
   * @param {string} password - The password to validate
   * @returns {boolean} - True if valid, false if not
   */
  export const isValidPassword = (password) => {
    const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
    return re.test(password);
  };
  
  /**
   * Phone number validation
   * @param {string} phone - The phone number to validate
   * @returns {boolean} - True if valid, false if not
   */
  export const isValidPhone = (phone) => {
    const re = /^\+?[0-9]{10,15}$/;
    return re.test(phone);
  };
  
  /**
   * Validates soil data values are within reasonable ranges
   * @param {Object} soilData - The soil data object
   * @returns {Object} - Object with validation results
   */
  export const validateSoilData = (soilData) => {
    const errors = {};
    
    // Nitrogen: typically 0-140 ppm
    if (soilData.nitrogen < 0 || soilData.nitrogen > 140) {
      errors.nitrogen = 'Nitrogen should be between 0-140 ppm';
    }
    
    // Phosphorus: typically 0-100 ppm
    if (soilData.phosphorus < 0 || soilData.phosphorus > 100) {
      errors.phosphorus = 'Phosphorus should be between 0-100 ppm';
    }
    
    // Potassium: typically 0-800 ppm
    if (soilData.potassium < 0 || soilData.potassium > 800) {
      errors.potassium = 'Potassium should be between 0-800 ppm';
    }
    
    // pH: typically 3.5-10
    if (soilData.ph_level < 3.5 || soilData.ph_level > 10) {
      errors.ph_level = 'pH should be between 3.5-10';
    }
    
    // Rainfall: reasonable range
    if (soilData.rainfall < 0 || soilData.rainfall > 10000) {
      errors.rainfall = 'Rainfall should be between 0-10000 mm';
    }
    
    // Temperature: reasonable range
    if (soilData.temperature < -20 || soilData.temperature > 50) {
      errors.temperature = 'Temperature should be between -20°C and 50°C';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };