import React from 'react';

interface CountdownTimerProps {
  endTime: Date;
  onComplete?: () => void;
  className?: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  endTime,
  onComplete,
  className = '',
}) => {
  const formatTime = (seconds: number): string => {
    if (seconds <= 0) return 'Время вышло!';
    
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${days}д ${hours}ч ${minutes}м ${remainingSeconds}с`;
  };

  // Calculate the difference between end time and now (in seconds)
  const diffInSeconds = Math.max(0, Math.floor((endTime.getTime() - Date.now()) / 1000));

  // Since this is a pure component, we don't use useEffect or side effects
  // The value will be recalculated on each render based on current time

  return (
    <div className={className}>
      {formatTime(diffInSeconds)}
    </div>
  );
};

export default CountdownTimer;
