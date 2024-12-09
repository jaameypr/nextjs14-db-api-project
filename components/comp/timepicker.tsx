"use client"; // Markiert diese Datei als Client-Komponente in einem Next.js-Umfeld

import { useEffect, useState } from "react"; // Importiert React-Hooks: useEffect und useState

// Definition der TimePicker-Komponente mit den übergebenen Eigenschaften
const TimePicker = ({
                        initialTime, // Initiale Zeit, die bei der Erstellung gesetzt wird
                        onTimeChange, // Funktion, die aufgerufen wird, wenn sich die Zeit ändert
                    }: {
    initialTime: Date | null; // Die initiale Zeit kann ein Date-Objekt oder null sein
    onTimeChange: (time: Date) => void; // Callback-Funktion für Änderungen der Zeit
}) => {
    // Lokaler Zustand für die aktuell ausgewählte Zeit, standardmäßig die aktuelle Zeit
    const [time, setTime] = useState<Date>(initialTime || new Date());

    // Funktion zum Hinzufügen oder Subtrahieren von Minuten
    const addMinutes = (minutes: number) => {
        setTime((prevTime) => {
            const newTime = new Date(prevTime); // Kopiert die vorherige Zeit
            newTime.setMinutes(newTime.getMinutes() + minutes); // Fügt die angegebenen Minuten hinzu
            return newTime; // Gibt die neue Zeit zurück
        });
    };

    // Funktion zum Setzen der aktuellen Zeit
    const setNow = () => {
        const now = new Date(); // Holt die aktuelle Zeit
        setTime(now); // Aktualisiert den Zustand
    };

    // Funktion zur Formatierung der Zeit als String (z. B. "14:30")
    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); // Gibt die Zeit in einem kompakten Format zurück
    };

    // Effekt: Ruft die Callback-Funktion `onTimeChange` immer auf, wenn sich der Zustand `time` ändert
    useEffect(() => {
        onTimeChange(time);
    }, [time, onTimeChange]);

    return (
        <div className="time-picker-container flex items-center space-x-4">
            {/* Button zum Reduzieren der Zeit um 1 Minute */}
            <button
                className="time-button text-red-500 font-bold text-2xl"
                onClick={() => addMinutes(-1)}
            >
                -
            </button>

            {/* Anzeige der aktuellen Zeit */}
            <div className="time-display text-3xl font-bold">
                {formatTime(time)}
            </div>

            {/* Button zum Erhöhen der Zeit um 1 Minute */}
            <button
                className="time-button text-red-500 font-bold text-2xl"
                onClick={() => addMinutes(1)}
            >
                +
            </button>

            {/* Button zum Setzen der aktuellen Zeit */}
            <button
                className="now-button border rounded-lg px-4 py-2"
                onClick={setNow}
            >
                Jetzt
            </button>
        </div>
    );
};

export default TimePicker; // Exportiert die Komponente zur Wiederverwendung
