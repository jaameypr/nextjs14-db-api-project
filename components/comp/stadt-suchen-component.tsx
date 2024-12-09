import { Label } from "@/components/ui/label"; // Importiert das Label-Element aus den UI-Komponenten
import { Input } from "@/components/ui/input"; // Importiert das Input-Element aus den UI-Komponenten
import { HTMLAttributes, useEffect, useRef, useState } from "react"; // Importiert benötigte React-Hooks und Typen
import { getStationsV2 } from "@/lib/apiCalls"; // Importiert die Funktion zur Abruf von Bahnhöfen
import { Bahnhof } from "@/lib/types/type"; // Importiert den Typ "Bahnhof"
import { toast } from "@/hooks/use-toast"; // Importiert die Toast-Funktion zur Anzeige von Benachrichtigungen

// Definiert die Typen für die Eigenschaften der Searchbox-Komponente
interface SearchboxProps extends HTMLAttributes<HTMLDivElement> {
    setVal: (value: Bahnhof | null) => void; // Funktion, um den ausgewählten Bahnhof im übergeordneten Zustand zu speichern
    placeholder: string; // Platzhaltertext für das Eingabefeld
    title: string; // Titel/Bezeichnung des Eingabefelds
}

// Definition der Searchbox-Komponente
export default function Searchbox({ setVal, placeholder, title, ...props }: SearchboxProps) {
    const inputRef = useRef<HTMLInputElement>(null); // Referenz auf das Eingabefeld
    const listRef = useRef<HTMLUListElement>(null); // Referenz auf die Dropdown-Liste
    const [value, setValue] = useState(""); // Zustand für den Eingabewert
    const [cities, setCities] = useState<Bahnhof[]>([]); // Zustand für die Liste der Bahnhöfe
    const [showDropdown, setShowDropdown] = useState(false); // Zustand, ob die Dropdown-Liste angezeigt wird
    const [selectedCity, setSelectedCity] = useState<Bahnhof | null>(null); // Zustand für die ausgewählte Stadt

    // Funktion zum Abrufen der Städte basierend auf dem Eingabewert
    const completeCities = async () => {
        if (value === "") { // Wenn der Eingabewert leer ist
            setCities([]); // Liste der Bahnhöfe leeren
            setShowDropdown(false); // Dropdown ausblenden
            return;
        }

        try {
            const res = await getStationsV2(value); // API-Aufruf mit dem aktuellen Eingabewert

            if (Array.isArray(res)) { // Überprüft, ob die Antwort ein Array ist (Erfolg)
                setCities(res); // Setzt die Liste der Bahnhöfe
                setShowDropdown(true); // Zeigt die Dropdown-Liste an
            } else if ("error" in res && res.error) { // Überprüft, ob die Antwort einen Fehler enthält
                console.error("Error fetching cities:", res.message); // Gibt die Fehlermeldung in der Konsole aus
                toast({ title: "Fehler", description: res.message }); // Zeigt eine Fehlermeldung im Toast an
                setCities([]); // Leert die Liste der Bahnhöfe
                setShowDropdown(false); // Blendet die Dropdown-Liste aus
            }
        } catch (error) { // Fängt unerwartete Fehler ab
            console.error("Unexpected error fetching cities:", error); // Gibt den Fehler in der Konsole aus
            setCities([]); // Leert die Liste der Bahnhöfe
            setShowDropdown(false); // Blendet die Dropdown-Liste aus
        }
    };

    useEffect(() => {
        console.log("Cities:", cities); // Protokolliert die aktuelle Liste der Städte
    }, [cities]); // Wird ausgeführt, wenn sich die Liste der Städte ändert

    const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null); // Timer-Zustand für Debouncing
    useEffect(() => {
        if (debounceTimer) { // Löscht den vorherigen Timer
            clearTimeout(debounceTimer);
        }

        const newTimer = setTimeout(() => { // Startet einen neuen Timer
            if (value !== selectedCity?.name) { // Führt die Funktion aus, wenn der Eingabewert nicht der ausgewählten Stadt entspricht
                completeCities();
            }
        }, 500); // Verzögerung von 500ms

        setDebounceTimer(newTimer); // Speichert den neuen Timer

        return () => { // Aufräumfunktion
            if (newTimer) {
                clearTimeout(newTimer); // Löscht den aktuellen Timer
            }
        };
    }, [value]); // Wird ausgeführt, wenn sich der Eingabewert ändert

    // Zurücksetzen des Zustands, wenn das Eingabefeld geleert wird
    useEffect(() => {
        if (value === "") {
            setSelectedCity(null); // Setzt die ausgewählte Stadt zurück
            setVal(null); // Setzt den Zustand im übergeordneten Element zurück
            setShowDropdown(false); // Blendet die Dropdown-Liste aus
            setCities([]); // Leert die Liste der Städte
        }
    }, [value]);

    // Funktion zur Auswahl einer Stadt
    const handleSelectCity = (city: Bahnhof) => {
        setValue(city.name); // Setzt den Namen der Stadt als Eingabewert
        setSelectedCity(city); // Setzt die ausgewählte Stadt
        setShowDropdown(false); // Blendet die Dropdown-Liste aus
    };

    // Effekt zum Schließen der Dropdown-Liste bei Klick außerhalb
    useEffect(() => {
        const closeDropdown = (e: MouseEvent) => {
            if (inputRef.current && !inputRef.current.contains(e.target as Node)) { // Wenn der Klick außerhalb des Eingabefelds erfolgt
                if (listRef.current && !listRef.current.contains(e.target as Node)) { // Und außerhalb der Dropdown-Liste
                    setShowDropdown(false); // Blendet die Dropdown-Liste aus
                }
                if (debounceTimer) { // Löscht den Timer
                    clearTimeout(debounceTimer);
                }
            }
        };

        document.addEventListener("mousedown", closeDropdown); // Fügt den Event-Listener hinzu
        return () => {
            document.removeEventListener("mousedown", closeDropdown); // Entfernt den Event-Listener
        };
    }, [inputRef.current]);

    // Effekt, um die ausgewählte Stadt im übergeordneten Zustand zu speichern
    useEffect(() => {
        setVal(selectedCity); // Speichert die ausgewählte Stadt
    }, [selectedCity]);

    // JSX-Elemente der Searchbox-Komponente
    return (
        <div {...props}>
            <Label htmlFor={title} className="px-2">{title}</Label> {/* Label für das Eingabefeld */}
            <Input
                id={title}
                type="text"
                placeholder={placeholder}
                ref={inputRef}
                value={value}
                onChange={(e) => setValue(e.target.value)} // Aktualisiert den Eingabewert
                onFocus={() => cities.length > 0 && setShowDropdown(true)} // Zeigt die Dropdown-Liste an, wenn Städte vorhanden sind
            />
            {showDropdown && cities.length > 0 && ( // Zeigt die Dropdown-Liste an, wenn aktiv
                <ul
                    ref={listRef}
                    className="z-10 absolute bg-background border border-gray-300 mt-16 w-96 rounded-md shadow-lg max-h-60 overflow-auto"
                >
                    {cities.map((city) => ( // Listet alle Städte auf
                        <li
                            key={city.name} // Schlüssel für die Stadt
                            className="p-2 hover:bg-white/10 cursor-pointer"
                            onClick={() => handleSelectCity(city)} // Auswahl der Stadt bei Klick
                        >
                            {city.name} {/* Anzeigename der Stadt */}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
