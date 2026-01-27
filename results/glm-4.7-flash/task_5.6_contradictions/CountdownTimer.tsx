import React, { useEffect, useState } from 'react';

interface CountdownTimerProps {
  endTime: Date;
  onComplete?: () => void;
  className?: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ 
  endTime, 
  onComplete, 
  className = '' 
}) => {
  const [remainingTime, setRemainingTime] = useState<string>('');
  const [isComplete, setIsComplete] = useState<boolean>(false);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const diff = endTime.getTime() - now.getTime();

      if (diff <= 0) {
        setRemainingTime('Время вышло!');
        setIsComplete(true);
        if (onComplete) {
          onComplete();
        }
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setRemainingTime(
        `${days}д ${hours}ч ${minutes}м ${seconds}с`
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [endTime, onComplete]);

  return (
    <div className={className}>
      {remainingTime}
    </div>
  );
};

export default CountdownTimer;
