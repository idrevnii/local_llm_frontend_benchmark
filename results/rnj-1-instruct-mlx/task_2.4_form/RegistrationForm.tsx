import React, { useState } from 'react';

const RegistrationForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [formValid, setFormValid] = useState(false);

  const validateEmail = (email: string): string => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? '' : 'Invalid email format';
  };

  const validatePassword = (password: string): string => {
    return password.length >= 8 ? '' : 'Password must be at least 8 characters';
  };

  const validateConfirmPassword = (password: string, confirmPassword: string): string => {
    return password === confirmPassword ? '' : 'Passwords do not match';
  };

  const validateForm = () => {
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    const confirmPasswordErr = validateConfirmPassword(password, confirmPassword);

    setEmailError(emailErr);
    setPasswordError(passwordErr);
    setConfirmPasswordError(confirmPasswordErr);

    const isValid = !emailErr && !passwordErr && !confirmPasswordErr;
    setFormValid(isValid);
    return isValid;
  };

  const handleEmailBlur = () => {
    setEmailError(validateEmail(email));
    validateForm();
  };

  const handlePasswordBlur = () => {
    setPasswordError(validatePassword(password));
    validateForm();
  };

  const handleConfirmPasswordBlur = () => {
    setConfirmPasswordError(validateConfirmPassword(password, confirmPassword));
    validateForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      alert('Success!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={handleEmailBlur}
        />
        {emailError && <div>{emailError}</div>}
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={handlePasswordBlur}
        />
        {passwordError && <div>{passwordError}</div>}
      </div>
      <div>
        <label>Confirm Password:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onBlur={handleConfirmPasswordBlur}
        />
        {confirmPasswordError && <div>{confirmPasswordError}</div>}
      </div>
      <button type="submit" disabled={!formValid}>
        Submit
      </button>
    </form>
  );
};

export default RegistrationForm;
