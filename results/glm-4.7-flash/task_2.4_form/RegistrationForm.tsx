import React, { useState } from 'react';

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const RegistrationForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: 'email' | 'password' | 'confirmPassword') => {
    if (field === 'email') {
      if (email) {
        setErrors({ ...errors, email: validateEmail(email) ? undefined : 'Invalid email format' });
      }
    } else if (field === 'password') {
      if (password) {
        setErrors({ ...errors, password: password.length >= 8 ? undefined : 'Password must be at least 8 characters' });
      }
    } else if (field === 'confirmPassword') {
      if (confirmPassword) {
        setErrors({ ...errors, confirmPassword: confirmPassword === password ? undefined : 'Passwords do not match' });
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitted(true);
      alert('Success!');
      setIsSubmitted(false);
    }
  };

  const isFormValid = validateEmail(email) && password.length >= 8 && confirmPassword === password && email && password && confirmPassword;

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => handleBlur('email')}
        />
        {errors.email && <span>{errors.email}</span>}
      </div>
      
      <div>
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={() => handleBlur('password')}
        />
        {errors.password && <span>{errors.password}</span>}
      </div>
      
      <div>
        <label>Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onBlur={() => handleBlur('confirmPassword')}
        />
        {errors.confirmPassword && <span>{errors.confirmPassword}</span>}
      </div>
      
      <button type="submit" disabled={!isFormValid}>
        Register
      </button>
    </form>
  );
};

export default RegistrationForm;
