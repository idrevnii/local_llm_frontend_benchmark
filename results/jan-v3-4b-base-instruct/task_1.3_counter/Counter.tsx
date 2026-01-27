import React, { useState } from 'react';

interface CounterProps {
  initialValue?: number;
}

const Counter: React.FC<CounterProps> = ({ initialValue = 0 }) => {
  const [count, setCount] = useState<number>(initialValue);

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    setCount(count - 1);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Counter</h2>
      <p>Current count: {count}</p>
      <button onClick={decrement} style={{ marginRight: '10px', padding: '10px 15px', fontSize: '16px' }}>
        -
      </button>
      <button onClick={increment} style={{ padding: '10px 15px', fontSize: '16px' }}>
        +
      </button>
    </div>
  );
};

export default Counter;
