/**
 * Validation Types and Rules
 * A reusable validation system for forms
 */

// Validation rule types
export type ValidationRule<T = any> = {
  validate: (value: T) => boolean | string;
  message?: string;
};

// Validation result
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// Form validation rules
export const validationRules = {
  // Required field
  required: (value: any): boolean | string => {
    if (value === undefined || value === null || value === '') {
      return 'This field is required';
    }
    return true;
  },

  // Email validation
  email: (value: string): boolean | string => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    return true;
  },

  // Phone validation (simple format)
  phone: (value: string): boolean | string => {
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    if (!phoneRegex.test(value)) {
      return 'Please enter a valid phone number';
    }
    return true;
  },

  // Minimum length
  minLength: (min: number) => (value: string): boolean | string => {
    if (value.length < min) {
      return `Must be at least ${min} characters`;
    }
    return true;
  },

  // Maximum length
  maxLength: (max: number) => (value: string): boolean | string => {
    if (value.length > max) {
      return `Must be no more than ${max} characters`;
    }
    return true;
  },

  // Pattern matching
  pattern: (regex: RegExp, message?: string) => (value: string): boolean | string => {
    if (!regex.test(value)) {
      return message || 'Invalid format';
    }
    return true;
  },

  // Custom validation function
  custom: (validator: (value: any) => boolean | string, message?: string) => 
    (value: any): boolean | string => {
      const result = validator(value);
      return result === true ? true : (message || result);
    }
};

// Type-safe validation rule builder
export function createValidationRule<T>(
  rule: ValidationRule<T>
): ValidationRule<T> {
  return rule;
}

// Combine multiple rules
export function combineRules<T>(...rules: ValidationRule<T>[]): ValidationRule<T> {
  return {
    validate: (value: T) => {
      for (const rule of rules) {
        const result = rule.validate(value);
        if (result !== true) {
          return result;
        }
      }
      return true;
    }
  };
}

// Default error messages
export const defaultMessages = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  phone: 'Please enter a valid phone number',
  minLength: (min: number) => `Must be at least ${min} characters`,
  maxLength: (max: number) => `Must be no more than ${max} characters`,
  pattern: 'Invalid format'
};
