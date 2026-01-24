/**
 * BookingCalendar React TypeScript component
 * 
 * Shows a calendar with date range selection, blocked dates, minimum stay requirements,
 * and timezone handling. Component is controlled with value/onChange props.
 */

import React, { useState, useMemo, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isWithinInterval, addDays, isSameDay, parseISO } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

interface BookingCalendarProps {
  value: { startDate: Date | null; endDate: Date | null };
  onChange: (range: { startDate: Date; endDate: Date }) => void;
  blockedDates: Date[];
  minNights?: number;
  timezone?: string;
}

interface Day {
  date: Date;
  isToday: boolean;
  isBlocked: boolean;
  isStart: boolean;
  isEnd: boolean;
  isInRange: boolean;
  isSelectable: boolean;
  dayNumber: number;
}

const BookingCalendar = ({
  value,
  onChange,
  blockedDates,
  minNights = 3,
  timezone = Intl.DateTimeFormat().resolvedOptions().timeZone,
}: BookingCalendarProps) => {
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Convert blocked dates to timezone
  const normalizedBlockedDates = useMemo(() => {
    return blockedDates.map(date => {
      const utcDate = new Date(date);
      return utcToZonedTime(utcDate, timezone);
    });
  }, [blockedDates, timezone]);

  // Check if date is blocked
  const isDateBlocked = (date: Date) => {
    return normalizedBlockedDates.some(blockedDate => 
      isSameDay(date, blockedDate)
    );
  };

  // Check if date range is valid
  const isValidRange = (startDate: Date, endDate: Date) => {
    // Check minimum nights
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < minNights) return false;

    // Check if any date in range is blocked
    const daysInRange = eachDayOfInterval({ start: startDate, end: endDate });
    return !daysInRange.some(day => isDateBlocked(day));
  };

  // Generate calendar days
  const generateDays = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end });
    
    return days.map(day => {
      const isToday = isSameDay(day, new Date());
      const isBlocked = isDateBlocked(day);
      
      // Check if day can be part of a valid range
      let isSelectable = true;
      
      if (value.startDate) {
        // If we have a start date, check if this day can be end date
        isSelectable = isValidRange(value.startDate, day);
      } else if (value.endDate) {
        // If we have an end date but no start, this shouldn't happen in normal flow
        isSelectable = false;
      } else {
        // Selecting a start date - check if we can select this day as start
        const tomorrow = addDays(day, 1);
        isSelectable = isValidRange(day, tomorrow);
      }

      return {
        date: day,
        isToday,
        isBlocked,
        isStart: isSameDay(day, value.startDate),
        isEnd: isSameDay(day, value.endDate),
        isInRange: value.startDate && value.endDate && 
          isWithinInterval(day, { start: value.startDate!, end: value.endDate! }),
        isSelectable,
        dayNumber: day.getDate(),
      };
    });
  };

  const days = generateDays();

  // Handle date selection
  const handleDateClick = (date: Date) => {
    if (!date || isDateBlocked(date)) return;

    const utcDate = zonedTimeToUtc(date, timezone);
    
    if (!value.startDate) {
      // Select start date
      onChange({ startDate: utcDate, endDate: null });
    } else if (!value.endDate) {
      // Try to select end date
      if (isValidRange(value.startDate, utcDate)) {
        onChange({ startDate: value.startDate, endDate: utcDate });
      }
    }
  };

  // Calculate number of nights between dates
  const getNights = (startDate: Date, endDate: Date) => {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return format(date, 'MMM d', { timeZone: timezone });
  };

  return (
    <div className="booking-calendar">
      <div className="calendar-header">
        <button
          onClick={() => setCurrentMonth(prev => {
            const newMonth = new Date(prev);
            newMonth.setMonth(newMonth.getMonth() - 1);
            return newMonth;
          })}
        >
          Previous
        </button>
        <h3>{format(currentMonth, 'MMMM yyyy')}</h3>
        <button
          onClick={() => setCurrentMonth(prev => {
            const newMonth = new Date(prev);
            newMonth.setMonth(newMonth.getMonth() + 1);
            return newMonth;
          })}
        >
          Next
        </button>
      </div>

      <div className="calendar-grid">
        <div className="weekdays">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="weekday">{day}</div>
          ))}
        </div>

        {days.map((day, index) => {
          const isCurrentMonth = day.date.getMonth() === currentMonth.getMonth();
          const isPast = day.date < new Date();
          
          // Check if this day can be selected as start
          let canBeStart = true;
          if (isPast) canBeStart = false;
          if (day.isBlocked) canBeStart = false;
          if (value.endDate) canBeStart = false; // Shouldn't happen in normal flow
          
          // Check if this day can be selected as end
          let canBeEnd = true;
          if (isPast) canBeEnd = false;
          if (day.isBlocked) canBeEnd = false;
          if (!value.startDate) canBeEnd = false;

          return (
            <button
              key={index}
              className={`
                day
                ${!isCurrentMonth ? 'other-month' : ''}
                ${day.isToday ? 'today' : ''}
                ${day.isBlocked ? 'blocked' : ''}
                ${day.isStart ? 'start' : ''}
                ${day.isEnd ? 'end' : ''}
                ${day.isInRange ? 'in-range' : ''}
                ${!day.isSelectable ? 'disabled' : ''}
              `}
              onClick={() => canBeStart || canBeEnd ? handleDateClick(day.date) : undefined}
              onMouseEnter={() => {
                if (canBeStart && !value.startDate) {
                  setHoverDate(day.date);
                } else if (canBeEnd && value.startDate && !isPast && !day.isBlocked) {
                  setHoverDate(day.date);
                }
              }}
              onMouseLeave={() => setHoverDate(null)}
            >
              <span className="day-number">{day.dayNumber}</span>
              {hoverDate && (canBeStart || canBeEnd) && (
                <div className="tooltip">
                  {value.startDate 
                    ? `${getNights(value.startDate, hoverDate)} nights`
                    : 'Select start date'
                  }
                </div>
              )}
            </button>
          );
        })}
      </div>

      {value.startDate && (
        <div className="selected-range">
          <span>Selected: {formatDate(value.startDate)} to {value.endDate ? formatDate(value.endDate) : '...'}</span>
          {value.endDate && (
            <span className="nights-count">
              {getNights(value.startDate, value.endDate)} nights
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingCalendar;
