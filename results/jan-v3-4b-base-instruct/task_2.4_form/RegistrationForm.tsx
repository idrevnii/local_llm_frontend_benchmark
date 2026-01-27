import React, { useState } from 'react';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

const RegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Validate email format
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate password length
  const isValidPassword = (password: string): boolean => {
    return password.length >= 8;
  };

  // Validate confirmation match
  const isConfirmMatch = (password: string, confirmPassword: string): boolean => {
    return password === confirmPassword;
  };

  // Handle field change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Validate on blur
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    let error = '';
    
    if (name === 'email') {
      if (!isValidEmail(value)) {
        error = 'Please enter a valid email address.';
      }
    } else if (name === 'password') {
      if (!isValidPassword(value)) {
        error = 'Password must be at least 8 characters long.';
      }
    } else if (name === 'confirmPassword') {
      if (!isConfirmMatch(formData.password, value)) {
        error = 'Passwords do not match.';
      }
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: { [key: string]: string } = {};
    
    if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    
    if (!isValidPassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters long.';
    }
    
    if (!isConfirmMatch(formData.password, formData.confirmPassword)) {
      new errors.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    alert('Success!');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-center">Registration Form</h2>
      
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
      </div>
      
      <div className="mb-4">
        <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            errors.password ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
      </div>
      
      <div className="mb-6">
        <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
      </div>
      
      <button
        type="submit"
        disabled={Object.keys(errors).length > 0}
        className={`w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors ${
          Object.keys(errors).length > 0 ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        Register
      </button>
    </form>
  );
};

export default RegistrationForm;
