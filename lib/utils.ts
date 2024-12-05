import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts a Date object or date string to a formatted string.
 *
 * @param dateInput - The Date object or date string to be formatted.
 * @param options - Optional object to customize the output format.
 * @returns A formatted string representing the date, or an error message if the input is invalid.
 */
export function formatDateToString(
    dateInput: Date | string,
    options: {
        locale?: string; // Locale for formatting (e.g., 'en-US', 'de-DE')
        dateStyle?: "full" | "long" | "medium" | "short"; // Predefined date formats
        timeStyle?: "full" | "long" | "medium" | "short"; // Predefined time formats
        includeTime?: boolean; // Whether to include time in the output
    } = {}
): string {
    const {
        locale = "de-DE", // Default to US English
        dateStyle = "short",
        timeStyle = "short",
        includeTime = true,
    } = options;

    // Parse the input into a Date object if it's a string
    let date: Date;
    if (typeof dateInput === "string") {
        date = new Date(dateInput);
    } else if (dateInput instanceof Date) {
        date = dateInput;
    } else
        date = new Date(); // Use the current date/time if the input is invalid

    if (isNaN(date.getTime())) {
        date = new Date(); // Use the current date/time if the input is invalid
    }

    // Format the date
    const formatter = new Intl.DateTimeFormat(locale, {
        dateStyle,
        ...(includeTime ? { timeStyle } : {}), // Include time style only if needed
    });

    return formatter.format(date);
}

/**
 * Formats a date string into only the time portion.
 *
 * @param dateString - The input date string to be formatted.
 * @param options - Optional object to customize the output format.
 * @returns A string representing the time, or an error message if the input is invalid.
 */
export function formatTimeFromDateString(
    dateString: string,
    options: {
        locale?: string; // Locale for formatting (e.g., 'en-US', 'de-DE')
        timeStyle?: "full" | "long" | "medium" | "short"; // Predefined time formats
    } = {}
): string {
    const {
        locale = "de-DE", // Default to US English
        timeStyle = "short", // Default time format
    } = options;

    // Parse the input into a Date object
    let date = new Date(dateString);
    if (isNaN(date.getTime())) {
        date = new Date();
    }

    // Format only the time
    const formatter = new Intl.DateTimeFormat(locale, { timeStyle });

    return formatter.format(date);
}

/**
 * Calculates the time difference between two date strings in hours.
 *
 * @param startDateString - The start date string.
 * @param endDateString - The end date string.
 * @returns A formatted string representing the difference in hours and minutes.
 */
export function calculateTimeDifference(
    startDateString: string,
    endDateString: string
): string {
    // Parse the date strings into Date objects
    let startDate = new Date(startDateString);
    let endDate = new Date(endDateString);

    // Validate the dates
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        startDate = new Date()
        endDate = new Date()
    }

    // Calculate the difference in milliseconds
    const differenceInMilliseconds = endDate.getTime() - startDate.getTime();

    // Convert to hours and minutes
    const totalMinutes = Math.floor(differenceInMilliseconds / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours === 0) {
        return `${minutes} min`;
    }
    return `${hours} h und ${minutes} min`;
}
