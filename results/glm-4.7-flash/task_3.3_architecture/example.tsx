/**
 * Usage Example
 * Demonstrates how to use the validation system with different forms
 */

import React, { useState } from 'react';
import { useValidation, validationRules, combineRules } from './validation';

// Example 1: Registration Form
export function RegistrationForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    isValid,
    reset
  } = useValidation({
    initialValues: formData,
    rules: {
      email: [
        validationRules.required,
        validationRules.email
      ],
      password: [
        validationRules.required,
        validationRules.minLength(8),
        validationRules.maxLength(50)
      ],
      confirmPassword: [
        validationRules.required,
        (value: string) => value === formData.password || 'Passwords do not match'
      ],
      firstName: [
        validationRules.required,
        validationRules.minLength(2),
        validationRules.maxLength(50)
      ],
      lastName: [
        validationRules.required,
        validationRules.minLength(2),
        validationRules.maxLength(50)
      ]
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAll().isValid) {
      console.log('Form submitted:', values);
      alert('Registration successful!');
    }
  };

  return (
    <div className="registration-form">
      <h2>Registration</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={values.email}
            onChange={(e) => handleChange('email', e.target.value)}
            onBlur={() => handleBlur('email')}
          />
          {touched.email && errors.email && <span className="error">{errors.email}</span>}
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            value={values.password}
            onChange={(e) => handleChange('password', e.target.value)}
            onBlur={() => handleBlur('password')}
          />
          {touched.password && errors.password && <span className="error">{errors.password}</span>}
        </div>

        <div>
          <label>Confirm Password</label>
          <input
            type="password"
            value={values.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            onBlur={() => handleBlur('confirmPassword')}
          />
          {touched.confirmPassword && errors.confirmPassword && (
            <span className="error">{errors.confirmPassword}</span>
          )}
        </div>

        <div>
          <label>First Name</label>
          <input
            type="text"
            value={values.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            onBlur={() => handleBlur('firstName')}
          />
          {touched.firstName && errors.firstName && <span className="error">{errors.firstName}</span>}
        </div>

        <div>
          <label>Last Name</label>
          <input
            type="text"
            value={values.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            onBlur={() => handleBlur('lastName')}
          />
          {touched.lastName && errors.lastName && <span className="error">{errors.lastName}</span>}
        </div>

        <button type="submit" disabled={!isValid}>
          Register
        </button>
      </form>
    </div>
  );
}

// Example 2: Profile Settings Form
export function ProfileSettingsForm() {
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    website: '',
    phone: ''
  });

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    isValid,
    reset
  } = useValidation({
    initialValues: formData,
    rules: {
      username: [
        validationRules.required,
        validationRules.minLength(3),
        validationRules.maxLength(20),
        validationRules.custom(
          (value: string) => /^[a-zA-Z0-9_]+$/.test(value),
          'Username can only contain letters, numbers, and underscores'
        )
      ],
      bio: [
        validationRules.maxLength(200)
      ],
      website: [
        validationRules.custom(
          (value: string) => !value || /^https?:\/\/.+\..+/.test(value),
          'Please enter a valid URL'
        )
      ],
      phone: [
        validationRules.phone
      ]
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAll().isValid) {
      console.log('Profile updated:', values);
      alert('Profile updated successfully!');
    }
  };

  return (
    <div className="profile-settings">
      <h2>Profile Settings</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={values.username}
            onChange={(e) => handleChange('username', e.target.value)}
            onBlur={() => handleBlur('username')}
          />
          {touched.username && errors.username && <span className="error">{errors.username}</span>}
        </div>

        <div>
          <label>Bio</label>
          <textarea
            value={values.bio}
            onChange={(e) => handleChange('bio', e.target.value)}
            onBlur={() => handleBlur('bio')}
          />
          {touched.bio && errors.bio && <span className="error">{errors.bio}</span>}
        </div>

        <div>
          <label>Website</label>
          <input
            type="url"
            value={values.website}
            onChange={(e) => handleChange('website', e.target.value)}
            onBlur={() => handleBlur('website')}
          />
          {touched.website && errors.website && <span className="error">{errors.website}</span>}
        </div>

        <div>
          <label>Phone</label>
          <input
            type="tel"
            value={values.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            onBlur={() => handleBlur('phone')}
          />
          {touched.phone && errors.phone && <span className="error">{errors.phone}</span>}
        </div>

        <button type="submit" disabled={!isValid}>
          Save Changes
        </button>
      </form>
    </div>
  );
}

// Example 3: Checkout Form with Custom Rules
export function CheckoutForm() {
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
    address: '',
    city: '',
    zipCode: ''
  });

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    isValid,
    reset
  } = useValidation({
    initialValues: formData,
    rules: {
      cardNumber: [
        validationRules.required,
        validationRules.custom(
          (value: string) => /^\d{16}$/.test(value.replace(/\s/g, '')),
          'Please enter a valid 16-digit card number'
        )
      ],
      cardName: [
        validationRules.required,
        validationRules.minLength(2)
      ],
      expiry: [
        validationRules.required,
        validationRules.custom(
          (value: string) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(value),
          'Please enter a valid expiry date (MM/YY)'
        )
      ],
      cvv: [
        validationRules.required,
        validationRules.custom(
          (value: string) => /^\d{3,4}$/.test(value),
          'Please enter a valid CVV'
        )
      ],
      address: [
        validationRules.required,
        validationRules.minLength(5)
      ],
      city: [
        validationRules.required,
        validationRules.minLength(2)
      ],
      zipCode: [
        validationRules.required,
        validationRules.custom(
          (value: string) => /^\d{5}(-\d{4})?$/.test(value),
          'Please enter a valid ZIP code'
        )
      ]
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAll().isValid) {
      console.log('Checkout submitted:', values);
      alert('Order placed successfully!');
    }
  };

  return (
    <div className="checkout-form">
      <h2>Checkout</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Card Number</label>
          <input
            type="text"
            value={values.cardNumber}
            onChange={(e) => handleChange('cardNumber', e.target.value)}
            onBlur={() => handleBlur('cardNumber')}
          />
          {touched.cardNumber && errors.cardNumber && <span className="error">{errors.cardNumber}</span>}
        </div>

        <div>
          <label>Card Name</label>
          <input
            type="text"
            value={values.cardName}
            onChange={(e) => handleChange('cardName', e.target.value)}
            onBlur={() => handleBlur('cardName')}
          />
          {touched.cardName && errors.cardName && <span className="error">{errors.cardName}</span>}
        </div>

        <div>
          <label>Expiry Date</label>
          <input
            type="text"
            value={values.expiry}
            onChange={(e) => handleChange('expiry', e.target.value)}
            onBlur={() => handleBlur('expiry')}
            placeholder="MM/YY"
          />
          {touched.expiry && errors.expiry && <span className="error">{errors.expiry}</span>}
        </div>

        <div>
          <label>CVV</label>
          <input
            type="text"
            value={values.cvv}
            onChange={(e) => handleChange('cvv', e.target.value)}
            onBlur={() => handleBlur('cvv')}
          />
          {touched.cvv && errors.cvv && <span className="error">{errors.cvv}</span>}
        </div>

        <div>
          <label>Address</label>
          <input
            type="text"
            value={values.address}
            onChange={(e) => handleChange('address', e.target.value)}
            onBlur={() => handleBlur('address')}
          />
          {touched.address && errors.address && <span className="error">{errors.address}</span>}
        </div>

        <div>
          <label>City</label>
          <input
            type="text"
            value={values.city}
            onChange={(e) => handleChange('city', e.target.value)}
            onBlur={() => handleBlur('city')}
          />
          {touched.city && errors.city && <span className="error">{errors.city}</span>}
        </div>

        <div>
          <label>ZIP Code</label>
          <input
            type="text"
            value={values.zipCode}
            onChange={(e) => handleChange('zipCode', e.target.value)}
            onBlur={() => handleBlur('zipCode')}
          />
          {touched.zipCode && errors.zipCode && <span className="error">{errors.zipCode}</span>}
        </div>

        <button type="submit" disabled={!isValid}>
          Place Order
        </button>
      </form>
    </div>
  );
}

// Example 4: Adding Custom Rules
export function CustomValidationExample() {
  const [formData, setFormData] = useState({
    username: '',
    age: ''
  });

  // Define custom rules
  const customRules = {
    // Strong password rule
    strongPassword: (value: string): boolean | string => {
      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumbers = /\d/.test(value);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

      if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
        return 'Password must contain uppercase, lowercase, numbers, and special characters';
      }
      return true;
    },

    // Age validation
    ageRange: (value: number): boolean | string => {
      if (value < 18) {
        return 'You must be at least 18 years old';
      }
      if (value > 120) {
        return 'Please enter a valid age';
      }
      return true;
    }
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    isValid,
    reset
  } = useValidation({
    initialValues: formData,
    rules: {
      username: [
        validationRules.required,
        validationRules.minLength(3),
        validationRules.maxLength(20),
        validationRules.custom(
          customRules.strongPassword,
          'Password must meet complexity requirements'
        )
      ],
      age: [
        validationRules.required,
        validationRules.custom(customRules.ageRange)
      ]
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAll().isValid) {
      console.log('Custom validation submitted:', values);
      alert('Custom validation passed!');
    }
  };

  return (
    <div className="custom-validation">
      <h2>Custom Validation Example</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username (must have strong password)</label>
          <input
            type="text"
            value={values.username}
            onChange={(e) => handleChange('username', e.target.value)}
            onBlur={() => handleBlur('username')}
          />
          {touched.username && errors.username && <span className="error">{errors.username}</span>}
        </div>

        <div>
          <label>Age</label>
          <input
            type="number"
            value={values.age}
            onChange={(e) => handleChange('age', parseInt(e.target.value))}
            onBlur={() => handleBlur('age')}
          />
          {touched.age && errors.age && <span className="error">{errors.age}</span>}
        </div>

        <button type="submit" disabled={!isValid}>
          Validate
        </button>
      </form>
    </div>
  );
}
