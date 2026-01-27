import React, { useState, useMemo } from 'react';

// Define types for the component props and dates
interface BookingCalendarProps {
  value: { startDate: Date | null; endDate: Date | null };
  onChange: (range: { startDate: Date; endDate: Date }) => void;
  blockedDates: Date[];
  minNights?: number; // default 3
  timezone?: string;
}

// Helper function to format a date as YYYY-MM-DD
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Helper function to get the first day of the month for a given year and month
const getFirstDayOfMonth = (year: number, month: number): Date => {
  const firstDay = new Date(year, month, 1);
  return firstDay;
};

// Helper function to get the last day of the month for a given year and month
const getLastDayOfMonth = (year: number, month: number): Date => {
  const lastDay = new Date(year, month + 1, 0);
  return lastDay;
};

// Helper function to get the days in a month
const getDaysInMonth = (year: number, month: number): Date[] => {
  const firstDay = getFirstDayOfMonth(year, month);
  const lastDay = getLastDayOfMonth(year, month);
  const daysInMonth = [];
  
  // Add all days from the previous month to fill the starting week
  const prevMonthDays = (firstDay.getDay() === 0 ? 7 : firstDay.getDay()) - 1;
  for (let i = 0; i < prevMonthDays; i++) {
    const date = new Date(year, month - 1, 1 + i);
    daysInMonth.push(date);
  }
  
  // Add all days of the current month
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(year, month, day);
    daysInMonth.push(date);
  }
  
  return daysInMonth;
};

// Helper function to check if a given date is blocked
const isBlockedDate = (date: Date, blockedDates: Date[]): boolean => {
  const formattedDate = formatDate(date);
  return blockedDates.some((blockedDate) => formatDate(blockedDate) === formattedDate);
};

// Helper function to calculate the number of nights between two dates
const getNightsBetweenDates = (startDate: Date, endDate: Date): number => {
  if (!startDate || !endDate) return 0;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Ensure we're working with a valid range where start <= end
  if (start > end) {
    return 0;
  }
  
  // Calculate the difference in milliseconds and convert to days
  const diffInMs = end.getTime() - start.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  // Return the number of nights, which is the difference in days + 1
  return diffInDays + 1;
};

// Helper function to get a date from string format YYYY-MM-DD
const parseDate = (dateString: string): Date | null => {
  const [year, month, day] = dateString.split('-').map(Number);
  
  if (!year || !month || !day) return null;
  
  // Validate the day is within valid range for given month
  const date = new Date(year, month - 1, day);
  if (date.getDate() !== day) {
    return null; // Invalid date
  }
  
  return date;
};

// Main BookingCalendar component
const BookingCalendar: React.FC<BookingCalendarProps> = ({
  value,
  onChange,
  blockedDates,
  minNights = 3,
  timezone = 'UTC',
}) => {
  const { startDate, endDate } = value || { startDate: null, endDate: null };
  
  // Get current month and year
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  
  // Get days in the current month
  const daysInMonth = useMemo(() => getDaysInMonth(currentYear, currentMonth), [
    currentYear,
    currentMonth,
  ]);
  
  // Determine if a date is disabled (blocked or in past)
  const isDateDisabled = (date: Date): boolean => {
    // Check if the date is blocked
    if (isBlockedDate(date, blockedDates)) return true;
    
    // Check if the date is in the past
    if (date < new Date()) return true;
    
    return false;
  };
  
  // Determine if a date should be highlighted as available period
  const isAvailablePeriod = (date: Date): boolean => {
    // If no start or end date, don't highlight
    if (!startDate || !endDate) return false;
    
    // Check if the date falls within the selected range
    const startDay = new Date(startDate);
    const endDay = new Date(endDate);
    
    if (startDay > endDay) {
      return false; // Invalid range
    }
    
    // A date is in the available period if it's between start and end dates
    return date >= startDay && date <= endDay;
  };
  
  // Handle click on a day
  const handleDateClick = (date: Date): void => {
    const formattedDate = formatDate(date);
    
    // Check if this is a valid selection for the range
    if (!startDate) {
      // First selection - set start date
      onChange({ startDate: new Date(date), endDate: new Date(date) });
    } else if (date >= new Date(startDate)) {
      // Second selection - set end date
      const nights = getNightsBetweenDates(new Date(startDate), new Date(date));
      
      // Check minimum stay requirement
      if (nights < minNights) {
        return; // Cannot select a date that doesn't meet the minimum stay
      }
      
      onChange({ startDate: new Date(startDate), endDate: new Date(date) });
    } else {
      // Invalid selection - can't go back in time
      return;
    }
  };
  
  // Format day of week for display (e.g., Mon, Tue)
  const formatDayOfWeek = (date: Date): string => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
  };
  
  // Format date for display (e.g., Jan 1)
  const formatDateDisplay = (date: Date): string => {
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    
    return `${monthNames[date.getMonth()]} ${date.getDate()}`;
  };
  
  // Handle month navigation
  const navigateMonth = (direction: number): void => {
    setCurrentMonth((prev) => {
      let newMonth = prev + direction;
      
      if (newMonth < 0) {
        newMonth = 11; // Go to the last month of previous year
        setCurrentYear((prev) => prev - 1);
      } else if (newMonth > 11) {
        newMonth = 0; // Go to first month of next year
        setCurrentYear((prev) => prev + 1);
      }
      
      return newMonth;
    });
  };
  
  // Format tooltip text with number of nights
  const getTooltipText = (date: Date): string => {
    if (!startDate || !endDate) return '';
    
    const startDay = new Date(startDate);
    const endDay = new Date(endDate);
    
    if (startDay > endDay) return '';
    
    // Calculate the number of nights between two dates
    const diffInMs = endDay.getTime() - startDay.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    return `${diffInDays + 1} nights`;
  };
  
  // Calculate the day of the week for a given date
  const getDayOfWeek = (date: Date): number => {
    return date.getDay();
  };
  
  // Render calendar days
  const renderCalendarDays = () => {
    return (
      <div className="calendar-days">
        {daysInMonth.map((day, index) => {
          const isToday = day.toDateString() === today.toDateString();
          
          // Check if the date should be disabled (blocked or in past)
          const isDisabled = isDateDisabled(day);
          
          // Check if the date should be highlighted as part of available period
          const isHighlighted = isAvailablePeriod(day);
          
          return (
            <div
              key={index}
              className={`day ${isDisabled ? 'disabled' : ''} ${isHighlighted ? 'highlighted' : ''}`}
              style={{
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                opacity: isDisabled ? 0.5 : 1,
                backgroundColor: isHighlighted ? '#e6f7ff' : 'transparent',
              }}
              title={getTooltipText(day)}
              onClick={() => !isDisabled && handleDateClick(day)}
            >
              <div className="day-number">{day.getDate()}</div>
              {isToday && <span className="today-indicator">•</span>}
            </div>
          );
        })}
      </div>
    );
  };
  
  return (
    <div className="booking-calendar">
      {/* Calendar header with month navigation */}
      <header className="calendar-header">
        <button
          onClick={() => navigateMonth(-1)}
          aria-label="Previous month"
          className="nav-button prev"
        >
          &lt;
        </button>
        
        <h2>
          {new Date(currentYear, currentMonth, 1).toLocaleString('default', {
            month: 'long',
            year: 'numeric',
          })}
        </h2>
        
        <button
          onClick={() => navigateMonth(1)}
          aria-label="Next month"
          className="nav-button next"
        >
          &gt;
        </button>
      </header>
      
      {/* Calendar days grid */}
      {renderCalendarDays()}
    </div>
  );
};

export default BookingCalendar;
