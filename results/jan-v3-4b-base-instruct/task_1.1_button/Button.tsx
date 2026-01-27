import React from 'react';

interface ButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ text, onClick, disabled = false }) => {
  return (
    <button 
      type="button" 
      onClick={disabled ? undefined : onClick} 
      disabled={disabled}
      style={{ padding: '10px 20px', fontSize: '16px', cursor: disabled ? 'not-allowed' : 'pointer' }}
    >
      {text}
    </button>
  );
};

export default Button;
