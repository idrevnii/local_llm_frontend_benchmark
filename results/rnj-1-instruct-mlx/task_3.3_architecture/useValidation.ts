/**
 * useValidation hook
 */

import { useState } from "react";
import { ValidationRule, ValidationError, validateField } from "./validation";

export function useValidation() {
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const validate = (
    fieldName: string,
    value: string,
    rule: ValidationRule
  ) => {
    const fieldErrors = validateField(value, rule, fieldName);
    setErrors((prev) => [...prev.filter((e) => e.field !== fieldName), ...fieldErrors]);
    return fieldErrors.length === 0;
  };

  const addCustomRule = (name: string, validator: (value: string) => string | undefined) => {
    // In a real implementation, this would add to a registry
    console.log(`Custom rule ${name} registered`);
  };

  return {
    errors,
    validate,
    addCustomRule,
  };
}
