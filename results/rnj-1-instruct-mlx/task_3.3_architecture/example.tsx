/**
 * Example usage of the validation system
 */

import { useValidation } from "./useValidation";

export function RegistrationForm() {
  const validation = useValidation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real form, you would validate all fields before submission
    console.log("Form submitted");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email</label>
        <input
          type="email"
          onBlur={(e) => validation.validate("email", e.target.value as string, {
            required: true,
            email: true,
          })}
        />
        {validation.errors
          .filter((e) => e.field === "email")
          .map((error, index) => (
            <div key={index} style={{ color: "red" }}>
              {error.message}
            </div>
          ))}
      </div>

      <div>
        <label>Phone</label>
        <input
          type="tel"
          onBlur={(e) => validation.validate("phone", e.target.value as string, {
            phone: true,
          })}
        />
        {validation.errors
          .filter((e) => e.field === "phone")
          .map((error, index) => (
            <div key={index} style={{ color: "red" }}>
              {error.message}
            </div>
          ))}
      </div>

      <button type="submit">Register</button>
    </form>
  );
}
