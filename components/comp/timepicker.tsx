import {Dispatch, SetStateAction, useEffect, useState} from "react";

const TimePicker = ({setTimeRef}: {setTimeRef: Dispatch<SetStateAction<Date | undefined>>}) => {
    const [time, setTime] = useState<Date>(new Date());

    const addMinutes = (minutes: number) => {
        const newTime = new Date(time);
        newTime.setMinutes(time.getMinutes() + minutes);
        setTime(newTime);
    };

    const addHours = (hours: number) => {
        const newTime = new Date(time);
        newTime.setHours(time.getHours() + hours);
        setTime(newTime);
    };

    const setNow = () => {
        setTime(new Date());
    };

    // Helper function to format time as HH:mm
    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    useEffect(() => {
        return setTimeRef(time);
    }, [time]);

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