import { useState, useEffect } from 'react';

/**
 * Custom hook for persisting state in localStorage
 * @param key - localStorage key
 * @param initialValue - default value if nothing in storage
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
    // Initialize state with value from localStorage or initialValue
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            // Parse stored json or return initialValue
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    // Update localStorage when state changes
    const setValue = (value: T) => {
        try {
            setStoredValue(value);
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    };

    return [storedValue, setValue];
}
