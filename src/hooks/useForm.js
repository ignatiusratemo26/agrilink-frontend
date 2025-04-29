import { useState } from 'react';

/**
 * Custom hook for form handling
 * @param {Object} initialValues - Initial form values
 * @param {Function} onSubmit - Form submission handler
 * @param {Function} validate - Form validation function
 * @returns {Object} - Form values, errors, handlers, and form state
 */
const useForm = (initialValues, onSubmit, validate) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    
    setValues({
      ...values,
      [name]: fieldValue,
    });
    
    // Clear error when field is modified
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({
      ...touched,
      [name]: true,
    });
    
    // Validate field on blur if validation function is provided
    if (validate) {
      const fieldErrors = validate({ [name]: values[name] });
      if (fieldErrors[name]) {
        setErrors({
          ...errors,
          [name]: fieldErrors[name],
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    // Validate all fields on submit
    if (validate) {
      const formErrors = validate(values);
      setErrors(formErrors);
      
      // If there are errors, don't submit
      if (Object.keys(formErrors).length > 0) {
        return;
      }
    }
    
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    reset,
    setValues,
  };
};

export default useForm;