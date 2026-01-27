# Task 3.3: Validation System Architecture

Our application has many forms (registration, profile, settings, checkout) that use the same validation logic: email, phone, required, minLength, maxLength, pattern.

Design a reusable validation system architecture and show an example implementation.

## Requirements
- Declarative rule definition
- Ability to add custom rules
- Type safety (TypeScript)
- Error messages in English

## Expected deliverables
1. Validation types and rules (`validation.ts`)
2. useValidation hook (`useValidation.ts`)
3. Usage example (`example.tsx`)

Create all files in this directory.
