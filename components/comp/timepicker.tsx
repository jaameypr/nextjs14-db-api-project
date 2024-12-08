"use client";

import { useEffect, useState } from "react";

const TimePicker = ({
                        initialTime,
                        onTimeChange,
                    }: {
    initialTime: Date | null;
    onTimeChange: (time: Date) => void;
}) => {
    const [time, setTime] = useState<Date>(initialTime || new Date());

    const addMinutes = (minutes: number) => {
        setTime((prevTime) => {
            const newTime = new Date(prevTime);
            newTime.setMinutes(newTime.getMinutes() + minutes);
            return newTime;
        });
    };

    // const addHours = (hours: number) => {
    //     setTime((prevTime) => {
    //         const newTime = new Date(prevTime);
    //         newTime.setHours(newTime.getHours() + hours);
    //         return newTime;
    //     });
    // };

    const setNow = () => {
        const now = new Date();
        setTime(now);
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    useEffect(() => {
        onTimeChange(time);
    }, [time, onTimeChange]);

    return (
        <div className="time-picker-container flex items-center space-x-4">
            {/* Decrement time */}
            <button
                className="time-button text-red-500 font-bold text-2xl"
                onClick={() => addMinutes(-1)}
            >
                -
            </button>

            {/* Display time */}
            <div className="time-display text-3xl font-bold">
                {formatTime(time)}
            </div>

            {/* Increment time */}
            <button
                className="time-button text-red-500 font-bold text-2xl"
                onClick={() => addMinutes(1)}
            >
                +
            </button>

            {/* "Now" button */}
            <button
                className="now-button border rounded-lg px-4 py-2"
                onClick={setNow}
            >
                Jetzt
            </button>
        </div>
    );
};

export default TimePicker;
