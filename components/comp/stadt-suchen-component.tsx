"use client"

import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {HTMLAttributes, useEffect, useRef, useState} from "react";
import {getStations} from "@/lib/apiCalls";
import {Bahnhof} from "@/lib/types/type";

interface SearchboxProps extends HTMLAttributes<HTMLDivElement> {
    setVal: (value: Bahnhof) => void;
    placeholder: string;
    title: string;
}

export default function Searchbox({setVal, placeholder, title, ...props}: SearchboxProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const [value, setValue] = useState("");
    const [cities, setCities] = useState<Bahnhof[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedCity, setSelectedCity] = useState<Bahnhof>();

    // Function to fetch cities
    const completeCities = async () => {
        if (value === "") {
            setCities([]);
            setShowDropdown(false); // Hide the dropdown if input is cleared
            return;
        }

        try {
            const res = await getStations(value);
            setCities(res);
            setShowDropdown(true); // Show the dropdown when results are available
        } catch (error) {
            console.error("Error fetching cities:", error);
        }
    };

    const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);
    useEffect(() => {
        // Clear the previous timer if it exists
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }

        const newTimer = setTimeout(() => {
            if (value !== selectedCity?.name) {
                completeCities();
            }
        }, 500); // Adjust the debounce delay as needed

        setDebounceTimer(newTimer);

        // Cleanup the timer on unmount or when value changes
        return () => {
            if (newTimer) {
                clearTimeout(newTimer);
            }
        };
    }, [value]); // Re-run the effect when `value` changes

    // Handle city selection
    const handleSelectCity = (city: Bahnhof) => {
        setValue(city.name);
        setSelectedCity(city)
        setShowDropdown(false);
    };

    useEffect(() => {
        const closeDropdown = (e: MouseEvent) => {
            if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
                if (listRef.current && !listRef.current.contains(e.target as Node))
                setShowDropdown(false);
                if (debounceTimer)
                    clearTimeout(debounceTimer);
            }
        }

        document.addEventListener("mousedown", closeDropdown);
        return () => {
            document.removeEventListener("mousedown", closeDropdown);
        }
    }, [inputRef.current]);

    useEffect(() => {
        if (selectedCity)
            setVal(selectedCity);
    }, [selectedCity]);

    return (
        <div {...props}>
            <Label htmlFor={title} className="px-2">{title}</Label>
            <Input
                id={title}
                type="text"
                placeholder={placeholder}
                ref={inputRef}
                value={value}
                onChange={e => setValue(e.target.value)}
                onFocus={() => cities.length > 0 && setShowDropdown(true)} // Show dropdown on focus if there are results
            />

            {/* Render dropdown if cities are available */}
            {showDropdown && cities.length > 0 && (
                <ul ref={listRef} className="z-10 absolute bg-background border border-gray-300 mt-16 w-96 rounded-md shadow-lg max-h-60 overflow-auto">
                    {cities.map((city) => (
                        <li
                            key={city.name}
                            className="p-2 hover:bg-white/10 cursor-pointer"
                            onClick={() => handleSelectCity(city)}
                        >
                            {city.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}