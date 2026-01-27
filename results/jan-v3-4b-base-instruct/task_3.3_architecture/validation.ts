export type RuleType = 'required' | 'minLength' | 'maxLength' | 'pattern' | 'email' | 'phone';

export interface ValidationRule {
  type: RuleType;
  message?: string;
  value?: any;
}

export interface ValidationResult {
  isValid: boolean;
  errors: { [field: string]: string[] };
}
