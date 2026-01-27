import { useState, useEffect } from 'react';
import { ValidationRule, ValidationResult } from './validation';

export function useValidation(initialValues: { [key: string]: any } = {}, rules: { [key: string]: ValidationRule[] } = {}) {
  const [values, setValues] = useState<{ [key: string]: any }>(initialValues);
  const [errors, setErrors] = useState<{ [field: string]: string[] }>({});
  const [result, setResult] = useState<ValidationResult>({
    isValid: true,
    errors: {},
  });

  useEffect(() => {
    validate();
  }, []);

  const validateField = (fieldName: string) => {
    const fieldRules = rules[fieldName] || [];
    const fieldErrors: string[] = [];

    if (!fieldRules.length) return;

    for (const rule of fieldRules) {
      switch (rule.type) {
        case 'required':
          if (!values[fieldName]) {
            fieldErrors.push(rule.message || `This field is required`);
          }
          break;
        case 'minLength':
          const value = values[fieldName];
          if (value && value.toString().length < rule.value!) {
            fieldErrors.push(rule.message || `Minimum length ${rule.value} is required`);
          }
          break;
        case 'maxLength':
          const value2 = values[fieldName];
          if (value2 && value2.toString().length > rule.value!) {
            fieldErrors.push(rule.message || `Maximum length ${rule.value} is exceeded`);
          }
          break;
        case 'pattern':
          const regex = new RegExp(rule.value as string);
          const stringValue = values[fieldName] ? values[fieldName].toString() : '';
          if (!regex.test(stringValue)) {
            fieldErrors.push(rule.message || `Invalid pattern`);
          }
          break;
        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(values[fieldName] as string)) {
            fieldErrors.push(rule.message || `Please enter a valid email address`);
          }
          break;
        case 'phone':
          const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
          if (!phoneRegex.test(values[fieldName] as string)) {
            fieldErrors.push(rule.message || `Invalid phone number format`);
          }
          break;
      }
    }

    setErrors((prev) => ({
      ...prev,
      [fieldName]: fieldErrors
    }));
  };

  const validate = () => {
    const newErrors: { [field: string]: string[] } = {};
    Object.keys(rules).forEach(fieldName => {
      validateField(fieldName);
    });

    setResult({
      isValid: Object.keys(errors).length === 0,
      errors
    });
  };

  return {
    values,
    errors,
    result,
    setValue: (fieldName: string, value: any) => {
      setValues((prev) => ({
        ...prev,
        [fieldName]: value
      }));
      validateField(fieldName);
    },
    clearErrors: () => {
      setErrors({});
    }
  };
}
