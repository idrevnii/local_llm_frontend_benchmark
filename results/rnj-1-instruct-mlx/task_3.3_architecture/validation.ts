/**
 * Validation types and rules
 */

export type ValidationRule = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  phone?: boolean;
  custom?: (value: string) => string | undefined;
};

export type ValidationError = {
  field: string;
  message: string;
};

export function validateField(
  value: string,
  rule: ValidationRule,
  fieldName: string
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (rule.required && (!value || value.trim().length === 0)) {
    errors.push({
      field: fieldName,
      message: "This field is required",
    });
  }

  if (rule.minLength && value.length < rule.minLength) {
    errors.push({
      field: fieldName,
      message: `Must be at least ${rule.minLength} characters`,
    });
  }

  if (rule.maxLength && value.length > rule.maxLength) {
    errors.push({
      field: fieldName,
      message: `Must not exceed ${rule.maxLength} characters`,
    });
  }

  if (rule.pattern && !rule.pattern.test(value)) {
    errors.push({
      field: fieldName,
      message: "Invalid format",
    });
  }

  if (rule.email && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      errors.push({
        field: fieldName,
        message: "Invalid email address",
      });
    }
  }

  if (rule.phone && value) {
    const phoneRegex = /^\+?\d{10,15}$/;
    if (!phoneRegex.test(value)) {
      errors.push({
        field: fieldName,
        message: "Invalid phone number",
      });
    }
  }

  if (rule.custom) {
    const customError = rule.custom(value);
    if (customError) {
      errors.push({
        field: fieldName,
        message: customError,
      });
    }
  }

  return errors;
}
