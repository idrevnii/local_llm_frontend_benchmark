import React, { useState, useEffect, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, addMonths, subMonths, isSameDay, isPast, isSameMonth, startOfDay, endOfDay } from 'date-fns';

interface BookingCalendarProps {
  value: { startDate: Date | null; endDate: Date | null };
  onChange: (range: { startDate: Date; endDate: Date }) => void;
  blockedDates: Date[];
  minNights?: number;
  timezone?: string;
}

interface DateCell {
  date: Date;
  isBlocked: boolean;
  isPast: boolean;
  isMinStay: boolean;
  isSelectable: boolean;
  nights: number;
}

export const BookingCalendar: React.FC<BookingCalendarProps> = ({
  value,
  onChange,
  blockedDates,
  minNights = 3,
  timezone = 'UTC'
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { startDate, endDate } = value;

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = monthEnd.getDate();

  const generateCalendarDays = (): DateCell[] => {
    const days: DateCell[] = [];
    const startDay = monthStart.getDay();
    
    const prevMonthEnd = new Date(monthStart);
    prevMonthEnd.setDate(prevMonthEnd.getDate() - startDay);
    
    for (let i = startDay; i > 0; i--) {
      const date = new Date(prevMonthEnd);
      date.setDate(date.getDate() - (i - 1));
      days.push(createDateCell(date));
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(monthStart);
      date.setDate(i);
      days.push(createDateCell(date));
    }
    
    const remainingDays = 42 - days.length;
    const nextMonthStart = new Date(monthEnd);
    nextMonthStart.setDate(nextMonthStart.getDate() + 1);
    
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(nextMonthStart);
      date.setDate(date.getDate() + i - 1);
      days.push(createDateCell(date));
    }
    
    return days;
  };

  const createDateCell = (date: Date): DateCell => {
    const dateStart = startOfDay(date);
    const dateEnd = endOfDay(date);
    
    const isBlocked = blockedDates.some(
      blocked => startOfDay(blocked) <= dateStart && dateEnd <= endOfDay(blocked)
    );
    
    const isPast = dateStart < today;
    
    let isMinStay = false;
    let nights = 0;
    
    if (!isBlocked && !isPast && startDate) {
      const diffTime = date.getTime() - startDate.getTime();
      nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      isMinStay = nights < minNights;
    }
    
    const isSelectable = !isBlocked && !isPast && !isMinStay;
    
    return {
      date,
      isBlocked,
      isPast,
      isMinStay,
      isSelectable,
      nights
    };
  };

  const handleDateClick = (date: Date) => {
    const dateStart = startOfDay(date);
    
    if (!startDate) {
      onChange({ startDate: dateStart, endDate: null });
    } else if (startDate && !endDate) {
      if (dateStart < startDate) {
        onChange({ startDate: dateStart, endDate: null });
      } else {
        const nights = Math.ceil(date.getTime() - startDate.getTime() / (1000 * 60 * 60 * 24));
        if (nights >= minNights) {
          onChange({ startDate: startDate, endDate: dateStart });
        }
      }
    }
  };

  const handleDateHover = (date: Date) => {
    if (startDate && !endDate) {
      setHoveredDate(date);
    }
  };

  const handleMonthChange = (direction: 'prev' | 'next') => {
    const newMonth = direction === 'prev' ? subMonths(currentMonth, 1) : addMonths(currentMonth, 1);
    setCurrentMonth(newMonth);
  };

  const calendarDays = useMemo(() => generateCalendarDays(), [currentMonth, blockedDates, minNights]);

  const getCellStyle = (cell: DateCell): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      padding: '10px',
      textAlign: 'center',
      cursor: cell.isSelectable ? 'pointer' : 'not-allowed',
      borderRadius: '8px',
      transition: 'all 0.2s',
      position: 'relative'
    };
    
    if (cell.isBlocked) {
      baseStyle.backgroundColor = '#f3f4f6';
      baseStyle.color = '#9ca3af';
      baseStyle.border = '1px solid #e5e7eb';
    } else if (cell.isPast) {
      baseStyle.backgroundColor = '#f9fafb';
      baseStyle.color = '#d1d5db';
      baseStyle.border = '1px solid #e5e7eb';
    } else if (cell.isMinStay) {
      baseStyle.backgroundColor = '#fef3c7';
      baseStyle.color = '#d97706';
      baseStyle.border = '1px solid #fcd34d';
    } else if (isSameDay(cell.date, startDate)) {
      baseStyle.backgroundColor = '#3b82f6';
      baseStyle.color = 'white';
      baseStyle.border = '2px solid #2563eb';
    } else if (startDate && !endDate && hoveredDate && cell.date > startDate && cell.date <= hoveredDate) {
      baseStyle.backgroundColor = '#dbeafe';
      baseStyle.color = '#1e40af';
      baseStyle.border = '1px solid #93c5fd';
    } else if (startDate && endDate && isSameDay(cell.date, endDate)) {
      baseStyle.backgroundColor = '#10b981';
      baseStyle.color = 'white';
      baseStyle.border = '2px solid #059669';
    } else {
      baseStyle.backgroundColor = 'white';
      baseStyle.color = '#1f2937';
      baseStyle.border = '1px solid #e5e7eb';
    }
    
    return baseStyle;
  };

  const getTooltip = (cell: DateCell): string | null => {
    if (cell.isBlocked || cell.isPast) return null;
    
    if (startDate && !endDate) {
      if (cell.date < startDate) return null;
      const nights = Math.ceil(cell.date.getTime() - startDate.getTime() / (1000 * 60 * 60 * 24));
      return `${nights} night${nights !== 1 ? 's' : ''} stay`;
    }
    
    if (startDate && endDate) {
      if (cell.date < startDate || cell.date > endDate) return null;
      const nights = Math.ceil(cell.date.getTime() - startDate.getTime() / (1000 * 60 * 60 * 24));
      return `${nights} night${nights !== 1 ? 's' : ''} stay`;
    }
    
    return null;
  };

  const getNightsDisplay = (cell: DateCell): string | null => {
    if (cell.isBlocked || cell.isPast) return null;
    
    if (startDate && !endDate) {
      if (cell.date < startDate) return null;
      const nights = Math.ceil(cell.date.getTime() - startDate.getTime() / (1000 * 60 * 60 * 24));
      if (nights < minNights) return `${nights} night${nights !== 1 ? 's' : ''}`;
      return `${nights} night${nights !== 1 ? 's' : ''} stay`;
    }
    
    if (startDate && endDate) {
      if (cell.date < startDate || cell.date > endDate) return null;
      const nights = Math.ceil(cell.date.getTime() - startDate.getTime() / (1000 * 60 * 60 * 24));
      return `${nights} night${nights !== 1 ? 's' : ''} stay`;
    }
    
    return null;
  };

  return (
    <div className="booking-calendar" style={{ padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button
          onClick={() => handleMonthChange('prev')}
          style={{
            padding: '8px 16px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            cursor: 'pointer',
            backgroundColor: 'white'
          }}
        >
          ←
        </button>
        
        <h2 style={{ margin: 0, fontSize: '1.5rem' }}>
          {format(currentMonth, 'MMMM yyyy', { timeZone: timezone })}
        </h2>
        
        <button
          onClick={() => handleMonthChange('next')}
          style={{
            padding: '8px 16px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            cursor: 'pointer',
            backgroundColor: 'white'
          }}
        >
          →
        </button>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} style={{ textAlign: 'center', fontWeight: '600', color: '#6b7280' }}>
            {day}
          </div>
        ))}
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
        {calendarDays.map((cell, index) => {
          const style = getCellStyle(cell);
          const tooltip = getTooltip(cell);
          const nightsDisplay = getNightsDisplay(cell);
          
          return (
            <div
              key={index}
              style={style}
              onClick={() => cell.isSelectable && handleDateClick(cell.date)}
              onMouseEnter={() => handleDateHover(cell.date)}
              onMouseLeave={() => setHoveredDate(null)}
            >
              <div style={{ fontSize: '1rem' }}>
                {format(cell.date, 'd')}
              </div>
              {nightsDisplay && (
                <div style={{ fontSize: '0.75rem', marginTop: '2px' }}>
                  {nightsDisplay}
                </div>
              )}
              {tooltip && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    whiteSpace: 'nowrap',
                    marginBottom: '4px',
                    zIndex: 10
                  }}
                >
                  {tooltip}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
        <div style={{ marginBottom: '8px' }}>
          <strong>Selected Range:</strong>
        </div>
        <div>
          Check-in: {startDate ? format(startDate, 'MMM d, yyyy', { timeZone }) : 'Not selected'}
        </div>
        <div>
          Check-out: {endDate ? format(endDate, 'MMM d, yyyy', { timeZone }) : 'Not selected'}
        </div>
        <div>
          <strong>Min nights: {minNights}</strong>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;
