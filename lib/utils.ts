import { clsx, type ClassValue } from "clsx"; // Importiert clsx für das dynamische Hinzufügen von CSS-Klassen
import { twMerge } from "tailwind-merge"; // Importiert twMerge zum Zusammenführen und Optimieren von Tailwind-Klassen

// Funktion zum Zusammenführen von CSS-Klassen
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs)); // Kombiniert clsx und twMerge, um Konflikte zwischen Tailwind-Klassen zu lösen
}

/**
 * Konvertiert ein Date-Objekt oder einen Datumsstring in eine formatierte Zeichenkette.
 *
 * @param dateInput - Das Date-Objekt oder der Datumsstring, der formatiert werden soll.
 * @param options - Optionales Objekt zur Anpassung des Ausgabeformats.
 * @returns Eine formatierte Zeichenkette, die das Datum repräsentiert, oder eine Fehlermeldung bei ungültigem Input.
 */
export function formatDateToString(
    dateInput: Date | string,
    options: {
        locale?: string; // Gebietsschema für die Formatierung (z. B. 'en-US', 'de-DE')
        dateStyle?: "full" | "long" | "medium" | "short"; // Vordefinierte Datumsformate
        timeStyle?: "full" | "long" | "medium" | "short"; // Vordefinierte Zeitformate
        includeTime?: boolean; // Ob die Zeit in die Ausgabe aufgenommen werden soll
    } = {}
): string {
    const {
        locale = "de-DE", // Standardmäßig deutsches Gebietsschema
        dateStyle = "short", // Standard-Datumsformat
        timeStyle = "short", // Standard-Zeitformat
        includeTime = true, // Standardmäßig wird die Zeit mit einbezogen
    } = options;

    // Konvertiert den Input in ein Date-Objekt, falls es ein String ist
    let date: Date;
    if (typeof dateInput === "string") {
        date = new Date(dateInput);
    } else if (dateInput instanceof Date) {
        date = dateInput;
    } else {
        date = new Date(); // Verwendet das aktuelle Datum/Zeit, falls der Input ungültig ist
    }

    // Überprüft, ob das Datum gültig ist
    if (isNaN(date.getTime())) {
        date = new Date(); // Verwendet das aktuelle Datum/Zeit, falls der Input ungültig ist
    }

    // Erstellt den Formatter für die Ausgabe
    const formatter = new Intl.DateTimeFormat(locale, {
        dateStyle,
        ...(includeTime ? { timeStyle } : {}), // Fügt das Zeitformat hinzu, falls erforderlich
    });

    return formatter.format(date); // Gibt das formatierte Datum zurück
}

/**
 * Formatiert einen Datumsstring nur in den Zeitanteil.
 *
 * @param dateString - Der Eingabe-Datumsstring, der formatiert werden soll.
 * @param options - Optionales Objekt zur Anpassung des Ausgabeformats.
 * @returns Eine Zeichenkette, die die Zeit repräsentiert, oder eine Fehlermeldung bei ungültigem Input.
 */
export function formatTimeFromDateString(
    dateString: string,
    options: {
        locale?: string; // Gebietsschema für die Formatierung (z. B. 'en-US', 'de-DE')
        timeStyle?: "full" | "long" | "medium" | "short"; // Vordefinierte Zeitformate
    } = {}
): string {
    const {
        locale = "de-DE", // Standardmäßig deutsches Gebietsschema
        timeStyle = "short", // Standard-Zeitformat
    } = options;

    // Konvertiert den Input in ein Date-Objekt
    let date = new Date(dateString);
    if (isNaN(date.getTime())) {
        date = new Date(); // Verwendet das aktuelle Datum/Zeit, falls der Input ungültig ist
    }

    // Erstellt den Formatter für die Zeit
    const formatter = new Intl.DateTimeFormat(locale, { timeStyle });

    return formatter.format(date); // Gibt die formatierte Zeit zurück
}

/**
 * Berechnet den Zeitunterschied zwischen zwei Datumsstrings in Stunden und Minuten.
 *
 * @param startDateString - Der Start-Datumsstring.
 * @param endDateString - Der End-Datumsstring.
 * @returns Eine formatierte Zeichenkette, die den Unterschied in Stunden und Minuten darstellt.
 */
export function calculateTimeDifference(
    startDateString: string,
    endDateString: string
): string {
    // Konvertiert die Datumsstrings in Date-Objekte
    let startDate = new Date(startDateString);
    let endDate = new Date(endDateString);

    // Validiert die Eingaben
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        startDate = new Date(); // Verwendet das aktuelle Datum/Zeit bei ungültigem Input
        endDate = new Date();
    }

    // Berechnet die Differenz in Millisekunden
    const differenceInMilliseconds = endDate.getTime() - startDate.getTime();

    // Konvertiert die Differenz in Minuten
    const totalMinutes = Math.floor(differenceInMilliseconds / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60); // Extrahiert die Stunden
    const minutes = totalMinutes % 60; // Extrahiert die verbleibenden Minuten

    // Gibt den Unterschied in Stunden und Minuten zurück
    if (hours === 0) {
        return `${minutes} min`;
    }
    return `${hours} h und ${minutes} min`;
}
