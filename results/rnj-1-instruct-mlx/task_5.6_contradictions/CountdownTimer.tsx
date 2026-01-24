import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  endTime: Date;
  onComplete?: () => void;
  className?: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ endTime, onComplete, className }) => {
  const [timeRemaining, setTimeRemaining] = useState(() => {
    return calculateTimeDifference(endTime);
  });

  useEffect(() => {
    const timerId = setInterval(() => {
      const newTimeRemaining = calculateTimeDifference(endTime);
      setTimeRemaining(newTimeRemaining);

      if (newTimeRemaining.total <= 0) {
        clearInterval(timerId);
        if (onComplete) {
          onComplete();
        }
      }
    }, 1000);

    return () => clearInterval(timerId);
  }, [endTime, onComplete]);

  if (timeRemaining.total <= 0) {
    return <span className={className}>Время вышло!</span>;
  }

  return (
    <span className={className}>
      {formatTimeRemaining(timeRemaining)}
    </span>
  );
};

interface TimeDifference {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

function calculateTimeDifference(endTime: Date): TimeDifference {
  const now = new Date();
  const difference = endTime.getTime() - now.getTime();
  
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  }

  const totalSeconds = Math.floor(difference / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
    total: totalSeconds
  };
}

function formatTimeRemaining(time: TimeDifference): string {
  const parts = [];
  
  if (time.days > 0) {
    parts.push(`${time.days}д`);
  }
  
  if (time.hours > 0 || parts.length > 0) {
    parts.push(`${time.hours}ч`);
  }
  
  if (time.minutes > 0 || parts.length > 0) {
    parts.push(`${time.minutes}м`);
  }
  
  parts.push(`${time.seconds}с`);

  return parts.join(' ');
}

export default CountdownTimer;
