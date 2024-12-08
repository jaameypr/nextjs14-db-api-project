"use client";

import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import TimePicker from "@/components/comp/timepicker";
import { PopoverClose } from "@radix-ui/react-popover";
import {addDays} from "date-fns";

export default function DateSearch({ setSelectedDate }: { setSelectedDate: (date: Date) => void }) {
    const [date, setDate] = useState<Date | null>(null);
    const [time, setTime] = useState<Date | null>(null);

    useEffect(() => {
        if (!date) {
            const now = new Date();
            setTime(now);
            setDate(now);
        }
    }, []);

    useEffect(() => {
        if (date && time) {
            const newDate = new Date(date);
            newDate.setHours(time.getHours(), time.getMinutes(), 0, 0);
            setSelectedDate(newDate);
            console.log("Merged Date:", newDate);
        }
    }, [date, time]);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
                <span>Reisedatum</span>
                <Select
                    onValueChange={(value) =>
                        setDate(addDays(new Date(), parseInt(value)))
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Schnellauswahl" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                        <SelectItem value="0">Heute</SelectItem>
                        <SelectItem value="1">Morgen</SelectItem>
                        <SelectItem value="3">In 3 Tagen</SelectItem>
                        <SelectItem value="7">In einer Woche</SelectItem>
                    </SelectContent>
                </Select>
                <div className="rounded-md border">
                    {/* @ts-ignore */}
                    <Calendar mode="single" selected={date} onSelect={setDate} />
                </div>

                {/* Time input */}
                <div className={"flex flex-row justify-center items-center"}>
                    <TimePicker initialTime={time} onTimeChange={setTime} />
                </div>

                <PopoverClose className={"w-full"}>
                    <Button variant={"default"} className={"w-full"}>
                        Übernehmen
                    </Button>
                </PopoverClose>
            </PopoverContent>
        </Popover>
    );
}
