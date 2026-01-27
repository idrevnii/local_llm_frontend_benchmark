import React from 'react';
import { useValidation } from './useValidation';

export function RegistrationForm() {
  const validation = useValidation(
    {
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    },
    {
      email: [
        { type: 'required', message: 'Email is required' },
        { type: 'email', message: 'Please enter a valid email address' }
      ],
      phone: [
        { type: 'required', message: 'Phone number is required' },
        { type: 'phone', message: 'Invalid phone number format' }
      ],
      password: [
        { type: 'required', message: 'Password is required' },
        { type: 'minLength', value: 8, message: 'Password must be at least 8 characters long' },
        { type: 'pattern', value: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)', message: 'Password must contain uppercase, lowercase and number' }
      ],
      confirmPassword: [
        { type: 'required', message: 'Confirm password is required' },
        { type: 'minLength', value: 8, message: 'Confirm password must be at least 8 characters long' },
        { type: 'pattern', value: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)', message: 'Confirm password must contain uppercase, lowercase and number' },
        { type: 'maxLength', value: 20, message: 'Confirm password cannot exceed 20 characters' }
      ]
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validation.result.isValid) {
      alert('Please fix the errors in the form');
      return;
    }
    console.log('Form submitted with values:', validation.values);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email</label>
        <input
          type="email"
          value={validation.values.email}
          onChange={(e) => validation.setValue('email', e.target.value)}
          required
        />
        {validation.errors.email && validation.errors.email.map((error, i) => (
          <p key={i} style={{ color: 'red' }}>{error}</p>
        ))}
      </div>

      <div>
        <label>Phone</label>
        <input
          type="tel"
          value={validation.values.phone}
          onChange={(e) => validation.setValue('phone', e.target.value)}
          required
        />
        {validation.errors.phone && validation.errors.phone.map((error, i) => (
          <p key={i} style={{ color: 'red' }}>{error}</p>
        ))}
      </div>

      <div>
        <label>Password</label>
        <input
          type="password"
          value={validation.values.password}
          onChange={(e) => validation.setValue('password', e.target.value)}
          required
        />
        {validation.errors.password && validation.errors.password.map((error, i) => (
          <p key={i} style={{ color: 'red' }}>{error}</p>
        ))}
      </div>

      <div>
        <label>Confirm Password</label>
        <input
          type="password"
          value={validation.values.confirmPassword}
          onChange={(e) => validation.setValue('confirmPassword', e.target.value)}
          required
        />
        {validation.errors.confirmPassword && validation.errors.confirmPassword.map((error, i) => (
          <p key={i} style={{ color: 'red' }}>{error}</p>
        ))}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}
