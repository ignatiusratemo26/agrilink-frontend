/**
 * Format currency values
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  };
  
  /**
   * Format date to local date string
   * @param {string|Date} date - Date to format
   * @returns {string} - Formatted date string
   */
  export const formatDate = (date) => {
    if (!date) return '';
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  /**
   * Format number with commas as thousands separators
   * @param {number} num - Number to format
   * @returns {string} - Formatted number string
   */
  export const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };
  
  /**
   * Truncate text with ellipsis
   * @param {string} text - Text to truncate
   * @param {number} maxLength - Maximum length
   * @returns {string} - Truncated text
   */
  export const truncateText = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  };
  
  /**
   * Convert weight units
   * @param {number} value - Value to convert
   * @param {string} from - Source unit (kg, g, ton)
   * @param {string} to - Target unit (kg, g, ton)
   * @returns {number} - Converted value
   */
  export const convertWeight = (value, from, to) => {
    // Convert to grams first
    let grams;
    switch (from.toLowerCase()) {
      case 'kg':
        grams = value * 1000;
        break;
      case 'g':
        grams = value;
        break;
      case 'ton':
        grams = value * 1000000;
        break;
      default:
        return value;
    }
    
    // Convert from grams to target unit
    switch (to.toLowerCase()) {
      case 'kg':
        return grams / 1000;
      case 'g':
        return grams;
      case 'ton':
        return grams / 1000000;
      default:
        return value;
    }
  };
  
  /**
   * Format soil data parameter values for display
   * @param {string} param - Parameter name
   * @param {number} value - Parameter value
   * @returns {string} - Formatted value with unit
   */
  export const formatSoilParameter = (param, value) => {
    if (value === undefined || value === null) return '';
    
    switch (param.toLowerCase()) {
      case 'nitrogen':
      case 'phosphorus':
      case 'potassium':
        return `${value} ppm`;
      case 'ph_level':
      case 'ph':
        return value.toFixed(1);
      case 'rainfall':
        return `${value} mm`;
      case 'temperature':
        return `${value}°C`;
      default:
        return value.toString();
    }
  };