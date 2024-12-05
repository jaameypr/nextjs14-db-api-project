"use client"
import {Button} from "@/components/ui/button";
import Searchbox from "@/components/comp/stadt-suchen-component";
import DateSearch from "@/components/comp/suche-mit-zeit";
import {useState} from "react";
import {getJourneyWithDepature} from "@/lib/apiCalls";
import {Bahnhof, JourneyResponse} from "@/lib/types/type";
import {toast} from "@/hooks/use-toast";
import {ClockIcon, MapPinIcon} from "lucide-react";
import {calculateTimeDifference, formatDateToString, formatTimeFromDateString} from "@/lib/utils";

export default function RoutenPlaner() {
    const [selectedStart, setSelectedStart] = useState<Bahnhof>();
    const [selectedEnd, setSelectedEnd] = useState<Bahnhof>();
    const [selectedDate, setSelectedDate] = useState<Date>();
    const [arrival, setArrival] = useState<boolean>(false);

    const [routes, setRoutes] = useState<JourneyResponse>()
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async () => {
        console.log(selectedStart, selectedEnd)
        if (selectedStart != null && selectedStart.evaNumbers.length > 0 && selectedEnd != null && selectedEnd.evaNumbers.length > 0 && selectedDate != null) {
            console.log("dsfs")
            try {
                setLoading(true);
                const res = await getJourneyWithDepature(selectedStart.evaNumbers[0].number, selectedEnd.evaNumbers[0].number, selectedDate);
                setRoutes(res);
                toast({title: "Route gefunden", description: JSON.stringify(res)})
            } catch (error) {
                console.error(error)
            }
        }
        setLoading(false);
    }

    return (
        <>
            <div className={"flex flex-col gap-2"}>
                <div className={"flex flex-row gap-2 items-end justify-start"}>
                    <form className={"flex flex-row gap-2"} autoComplete={"off"}>
                        <Searchbox placeholder={"Stendal..."} title={"Start"} className={"flex flex-col gap-2 w-96"}
                        setVal={setSelectedStart}/>
                        <Searchbox placeholder={"Hamburg..."} title={"Ziel"} className={"flex flex-col gap-2 w-96"}
                        setVal={setSelectedEnd}/>
                    </form>
                    <div className={"flex flex-row gap-2"}>
                        <DateSearch setSelectedDate={setSelectedDate}/>
                        <Button variant={"default"} className={"bg-pink-500 text-foreground hover:bg-pink-700"}
                        onClick={handleSubmit} disabled={loading}>
                            Suchen
                        </Button>
                    </div>
                </div>
                { routes && routes.journeys && routes.journeys.length > 0 && routes.journeys.map((journey, index) => (
                    <div className={"flex flex-row h-32 border-white/10 rounded-xl border-[1px] p-4 gap-2"}>
                        <div className={"flex flex-row gap-3 items-center"}>
                            <span className={"font-bold tracking-tighter"}>{formatTimeFromDateString(journey.legs[0].departure)} - {formatTimeFromDateString(journey.legs[0].arrival)}</span>
                            <span> | </span>
                            <span className={"text-xs"}>{calculateTimeDifference(journey.legs[0].departure, journey.legs[0].arrival)}</span>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}