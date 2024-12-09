"use client"; // Markiert diese Datei als eine Client-Komponente in Next.js

import { useEffect, useState } from "react"; // Importiert React-Hooks: useEffect und useState
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"; // Importiert die Popover-Komponente
import { CalendarIcon } from "@radix-ui/react-icons"; // Importiert ein Kalender-Symbol
import { cn } from "@/lib/utils"; // Importiert eine Hilfsfunktion zur Klassenkombination
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Importiert Selektions-Komponenten
import { Calendar } from "@/components/ui/calendar"; // Importiert eine Kalender-Komponente
import { Button } from "@/components/ui/button"; // Importiert die Button-Komponente
import TimePicker from "@/components/comp/timepicker"; // Importiert die TimePicker-Komponente
import { PopoverClose } from "@radix-ui/react-popover"; // Importiert eine Komponente zum Schließen des Popovers
import { addDays } from "date-fns"; // Importiert eine Funktion, um Tage zu einem Datum hinzuzufügen

// Hauptkomponente zur Datumsauswahl
export default function DateSearch({ setSelectedDate }: { setSelectedDate: (date: Date) => void }) {
    const [date, setDate] = useState<Date | null>(new Date()); // Zustand für das ausgewählte Datum
    const [time, setTime] = useState<Date | null>(new Date()); // Zustand für die ausgewählte Zeit

    // Effekt, um Datum und Zeit zu kombinieren und an die übergeordnete Komponente weiterzugeben
    useEffect(() => {
        if (date && time) {
            const newDate = new Date(date); // Kopiert das Datum
            newDate.setHours(time.getHours(), time.getMinutes(), 0, 0); // Setzt die Stunden und Minuten des Datums
            setSelectedDate(newDate); // Übergibt das kombinierte Datum und die Zeit an die übergeordnete Komponente
            console.log("Merged Date:", newDate); // Protokolliert das kombinierte Datum und die Zeit
        }
    }, [date, time]);

    return (
        <Popover>
            {/* Popover-Auslöser */}
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"} // Stilvariante für den Button
                    className={cn(
                        "justify-start text-left font-normal",
                        !date && "text-muted-foreground" // Muted-Stil, wenn kein Datum ausgewählt ist
                    )}
                >
                    <CalendarIcon /> {/* Kalender-Symbol */}
                </Button>
            </PopoverTrigger>

            {/* Inhalt des Popovers */}
            <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
                <span>Reisedatum</span> {/* Überschrift für das Reisedatum */}

                {/* Schnellauswahl für das Datum */}
                <Select
                    onValueChange={(value) =>
                        setDate(addDays(new Date(), parseInt(value))) // Berechnet das Datum basierend auf der Auswahl
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Schnellauswahl" /> {/* Platzhalter für die Auswahl */}
                    </SelectTrigger>
                    <SelectContent position="popper">
                        <SelectItem value="0">Heute</SelectItem> {/* Auswahl für heute */}
                        <SelectItem value="1">Morgen</SelectItem> {/* Auswahl für morgen */}
                        <SelectItem value="3">In 3 Tagen</SelectItem> {/* Auswahl für in 3 Tagen */}
                        <SelectItem value="7">In einer Woche</SelectItem> {/* Auswahl für in einer Woche */}
                    </SelectContent>
                </Select>

                {/* Kalender zur Datumsauswahl */}
                <div className="rounded-md border">
                    <Calendar
                        mode="single" // Einzelne Datumsauswahl
                        selected={date ?? new Date()} // Aktuell ausgewähltes Datum
                        onSelect={(day) => setDate(day ?? null)} // Aktualisiert das Datum
                    />
                </div>

                {/* Zeit-Eingabe */}
                <div className={"flex flex-row justify-center items-center"}>
                    <TimePicker initialTime={time} onTimeChange={setTime} /> {/* Zeit-Picker-Komponente */}
                </div>

                {/* Übernehmen-Button */}
                <PopoverClose className={"w-full"}>
                    <Button variant={"default"} className={"w-full"}>
                        Übernehmen
                    </Button>
                </PopoverClose>
            </PopoverContent>
        </Popover>
    );
}
