# Task 4.1: Booking Calendar (Complex)

Implement a BookingCalendar React TypeScript component with these requirements:

## Functionality
1. Shows current month with ability to navigate
2. User selects a date range (check-in and check-out dates)
3. Some dates are unavailable (passed via blockedDates prop)
4. Minimum booking period is 3 nights
5. Cannot select dates in the past

## UX Requirements
6. On hover, show tooltip with number of nights
7. When first date is selected, highlight available period
8. Dates that cannot complete minimum stay should be visually disabled

## Technical Requirements
9. Handle user timezone
10. Component should be controlled (value/onChange)
11. Full TypeScript typing, no `any`

## Props interface
```typescript
interface BookingCalendarProps {
  value: { startDate: Date | null; endDate: Date | null };
  onChange: (range: { startDate: Date; endDate: Date }) => void;
  blockedDates: Date[];
  minNights?: number; // default 3
  timezone?: string;
}
```

## Expected file
Create `BookingCalendar.tsx` in this directory.

> Note: This is an intentionally difficult task to test model limits.
