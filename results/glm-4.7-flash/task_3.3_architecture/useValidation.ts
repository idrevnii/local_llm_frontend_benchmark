/**
 * useValidation Hook
 * A React hook for managing form validation
 */

import { useState, useCallback, useMemo } from 'react';
import { ValidationResult, validationRules, ValidationRule, combineRules } from './validation';

interface UseValidationOptions<T extends Record<string, any>> {
  initialValues: T;
  rules: Record<keyof T, ValidationRule<any>[]>;
}

export function useValidation<T extends Record<string, any>>({
  initialValues,
  rules
}: UseValidationOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validate a single field
  const validateField = useCallback(
    (name: keyof T, value: any): string | true => {
      const fieldRules = rules[name];
      if (!fieldRules || fieldRules.length === 0) {
        return true;
      }

      for (const rule of fieldRules) {
        const result = rule.validate(value);
        if (result !== true) {
          return typeof result === 'string' ? result : 'Invalid value';
        }
      }
      return true;
    },
    [rules]
  );

  // Validate all fields
  const validateAll = useCallback((): ValidationResult => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    for (const name in rules) {
      const value = values[name];
      const result = validateField(name, value);
      
      if (result !== true) {
        newErrors[name as string] = result as string;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return { isValid, errors: newErrors };
  }, [values, rules, validateField]);

  // Handle field change
  const handleChange = useCallback(
    (name: keyof T, value: any) => {
      setValues(prev => ({ ...prev, [name]: value }));
      // Clear error when user starts typing
      if (touched[name]) {
        const result = validateField(name, value);
        if (result === true) {
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[name as string];
            return newErrors;
          });
        }
      }
    },
    [validateField, touched]
  );

  // Handle field blur (mark as touched)
  const handleBlur = useCallback(
    (name: keyof T) => {
      setTouched(prev => ({ ...prev, [name]: true }));
      const result = validateField(name, values[name]);
      if (result !== true) {
        setErrors(prev => ({
          ...prev,
          [name as string]: result as string
        }));
      }
    },
    [validateField, values]
  );

  // Reset form
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  // Check if field is valid
  const isValid = useCallback(
    (name: keyof T): boolean => {
      return errors[name as string] === undefined;
    },
    [errors]
  );

  // Check if field is touched
  const isTouched = useCallback(
    (name: keyof T): boolean => {
      return touched[name] || false;
    },
    [touched]
  );

  // Get error message for a field
  const getError = useCallback(
    (name: keyof T): string | undefined => {
      return errors[name as string];
    },
    [errors]
  );

  // Memoized validation result
  const validationResult = useMemo(() => {
    return { isValid: Object.keys(errors).length === 0, errors };
  }, [errors]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    reset,
    isValid,
    isTouched,
    getError,
    validationResult
  };
}

// Custom hook for single field validation
export function useFieldValidation<T>(
  value: T,
  rules: ValidationRule<any>[],
  isTouched: boolean = false
) {
  const [error, setError] = useState<string | undefined>();

  const validate = useCallback(() => {
    if (!isTouched) {
      setError(undefined);
      return;
    }

    for (const rule of rules) {
      const result = rule.validate(value);
      if (result !== true) {
        setError(typeof result === 'string' ? result : 'Invalid value');
        return;
      }
    }
    setError(undefined);
  }, [value, rules, isTouched]);

  useEffect(() => {
    validate();
  }, [validate]);

  return {
    error,
    isValid: error === undefined,
    validate
  };
}
