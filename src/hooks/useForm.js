import { useState } from 'react';

/**
 * Custom hook for handling any form in the app.
 * Performance: Minimizes re-renders by grouping state updates.
 */
export const useForm = (initialValues = {}, validate) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    
    // Clear error when user starts typing again
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleManualChange = (name, value) => {
    setValues({ ...values, [name]: value });
  };

  return {
    values,
    errors,
    isSubmitting,
    setIsSubmitting,
    setErrors,
    handleChange,
    handleManualChange,
    setValues
  };
};