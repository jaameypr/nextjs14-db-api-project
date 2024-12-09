"use client"
import {Button} from "@/components/ui/button";
import Searchbox from "@/components/comp/stadt-suchen-component";
import DateSearch from "@/components/comp/suche-mit-zeit";
import {useEffect, useState} from "react";
import {
    getJourneyByEarlierThan,
    getJourneyByLaterThan,
    getJourneyWithDepature,
    getStation,
    getStationsDepatures
} from "@/lib/apiCalls";
import {Bahnhof, Journey, JourneyResponse, JourneyWrapper} from "@/lib/types/type";
import {toast} from "@/hooks/use-toast";
import {calculateTimeDifference, cn, formatTimeFromDateString} from "@/lib/utils";
import {Separator} from "@/components/ui/separator";
import {ModalConfig} from "@/hooks/useModal";
import {BikeIcon, CarIcon, CarTaxiFront, ParkingCircle, TrainIcon, WifiIcon} from "lucide-react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {Elevator, Toilet, Wheelchair} from "@/components/comp/icons";

export default function RoutenPlaner({ openModal }: { openModal: (config: ModalConfig) => void }) {
    const [selectedStart, setSelectedStart] = useState<Bahnhof | null>();
    const [selectedEnd, setSelectedEnd] = useState<Bahnhof | null>();
    const [selectedDate, setSelectedDate] = useState<Date>();

    const [departures, setDepartures] = useState<Journey[]>();
    const [departureMode, setDepartureMode] = useState<boolean>(false);

    const [routes, setRoutes] = useState<JourneyResponse>()
    const [loading, setLoading] = useState<boolean>(false);

    const [searchedStart, setSearchedStart] = useState<string>();
    const [searchedEnd, setSearchedEnd] = useState<string>();

    const [expandedSection, setExpandedSection] = useState<JourneyWrapper>();

    const handleSubmit = async () => {
        if (selectedStart != null && selectedStart.id != "" && (selectedEnd == undefined) && selectedDate != null) {
            console.log(selectedStart.id);
            try {
                setLoading(true)
                const res = await getStationsDepatures(selectedStart.id, selectedDate);
                if (res && res.length > 0) {
                    // Abfahrten gefunden...
                    setDepartureMode(true);
                    setDepartures(res);
                    setRoutes(undefined);
                    toast({title: "Abfahrten gefunden", description: "Die Abfahrten wurden erfolgreich gefunden"});
                } else {
                    // Fehlerbehandlung
                    setDepartures(undefined);
                    setRoutes(undefined);
                    toast({title: "Keine Abfahrten gefunden", description: "Es wurden keine Abfahrten gefunden."});
                }
            }  catch (error) {
                // Fehlerbehandlung
                setDepartures(undefined);
                setRoutes(undefined);
                console.error(error)
            }
        } else if (selectedStart != null && selectedStart.id != "" && selectedEnd != null && selectedEnd.id != "" && selectedDate != null) {
            try {
                setLoading(true);
                const res = await getJourneyWithDepature(selectedStart.id, selectedEnd.id, selectedDate);
                if (res && res.journeys && res.journeys.length > 0) {
                    // Route gefunden...
                    setDepartureMode(false);
                    setDepartures(undefined);
                    setRoutes(res);
                    toast({title: "Route gefunden", description: "Die Route wurde erfolgreich gefunden"});
                    setSearchedEnd(selectedEnd.id);
                    setSearchedStart(selectedStart.id);
                } else {
                    // Fehlerbehandlung
                    setDepartures(undefined);
                    setRoutes(undefined);
                    toast({title: "Keine Route gefunden", description: "Es wurde keine Route gefunden."});
                }
            } catch (error) {
                // Fehlerbehandlung
                setDepartures(undefined);
                setRoutes(undefined);
                console.error(error)
            }
        }
        // lade status zurücksetzen
        setLoading(false);
    }

    // Funktion um eine Route zu finden, die früher ist
    const handleEarlier = async () => {
        if (routes && routes.earlierRef && searchedEnd && searchedStart) {
            try {
                setLoading(true);
                const res = await getJourneyByEarlierThan(searchedStart, searchedEnd, routes.earlierRef);
                if (res && res.journeys && res.journeys.length > 0) {
                    setRoutes(res);
                    toast({title: "Route gefunden", description: "Die Route wurde erfolgreich gefunden"});
                } else {
                    toast({title: "Keine Route gefunden", description: "Es wurde keine Route gefunden."});
                }
            } catch (error) {
                console.error(error)
            }
        }
        setLoading(false);
    }

    // Funktion um eine Route zu finden, die später ist
    const handleLater = async () => {
        if (routes && routes.laterRef && searchedEnd && searchedStart) {
            try {
                setLoading(true);
                const res = await getJourneyByLaterThan(searchedStart, searchedEnd, routes.laterRef);
                if (res && res.journeys && res.journeys.length > 0) {
                    setRoutes(res);
                    toast({title: "Route gefunden", description: "Die Route wurde erfolgreich gefunden"});
                } else {
                    toast({title: "Keine Route gefunden", description: "Es wurde keine Route gefunden."});
                }
            } catch (error) {
                console.error(error)
            }
        }
        setLoading(false);
    }

    // Funktion um zu überprüfen, ob eine Route erweitert ist
    const isExpanded = (journey: JourneyWrapper) => {
        return expandedSection === journey;
    }

    // Funktion um eine Route zu erweitern
    const expand = (journey: JourneyWrapper) => {
        setExpandedSection(journey);
    }

    // Funktion um eine Route zu schließen
    const setExpanded = (expanded: boolean, journey: JourneyWrapper) => {
        if (expanded) {
            expand(journey);
        } else {
            setExpandedSection(undefined);
        }
    }

    // Doppelte Routen zu entfernen...
    useEffect(() => {
        if (routes && routes.journeys) {
            const uniqueJourneys = routes.journeys.filter((journey, index, self) =>
                    index === self.findIndex((j) => (
                        j.legs[0].origin.name === journey.legs[0].origin.name &&
                        j.legs[0].destination.name === journey.legs[0].destination.name &&
                        j.legs[0].departure === journey.legs[0].departure &&
                        j.legs[0].arrival === journey.legs[0].arrival
                    ))
            );
            if (uniqueJourneys.length !== routes.journeys.length) {
                setRoutes((prevRoutes) => prevRoutes ? {
                    ...prevRoutes,
                    journeys: uniqueJourneys
                } : undefined);
            }
        }
    }, [routes]);

    return (
        <>
            <div className={"flex flex-col gap-2"}>
                <div className={"flex flex-row gap-2 items-end justify-start"}>
                    <form className={"flex flex-row gap-2"} autoComplete={"off"}>
                        <Searchbox placeholder={"Stendal..."} title={"Start"} className={"flex flex-col gap-2 w-96"}
                        setVal={setSelectedStart}/>
                        <Searchbox placeholder={"Hamburg..."} title={"Ziel (Optional)"} className={"flex flex-col gap-2 w-96"}
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
                { !departureMode && routes && routes.journeys && routes.journeys.length > 0 && routes.journeys.map((journey, index) => (
                    <div className={"flex flex-col border-white/10 rounded-xl border-[1px] p-4 gap-2"} key={index}>
                        <div className={"flex flex-row gap-3 items-center"}>
                            <span className={"font-bold tracking-tighter"}>{formatTimeFromDateString(journey.legs[0].departure)} - {formatTimeFromDateString(journey.legs[journey.legs.length - 1].arrival)}</span>
                            <span> | </span>
                            <span className={"text-xs"}>{calculateTimeDifference(journey.legs[0].departure, journey.legs[journey.legs.length - 1].arrival)}</span>
                        </div>
                        <JourneyRoute journeyWrapper={journey}/>
                        <Separator/>
                        <JourneyDetailsSection journeyWrapper={journey}
                                               openModal={openModal}
                                               toggle={() => setExpanded(!isExpanded(journey), journey)}
                                               isExpanded={isExpanded(journey)} />
                    </div>
                ))}

                { departureMode && departures && departures.length > 0 && departures.map((departure, index) => (
                    <div className={"flex flex-col border-white/10 rounded-xl border-[1px] p-4 gap-2"} key={index}>
                        <div className={"flex flex-row gap-3 items-center justify-between"}>
                            <div className={"flex flex-row gap-3 items-center"}>
                                <span
                                    className={"font-bold tracking-tighter"}>{formatTimeFromDateString(departure.plannedWhen)}</span>

                                { departure.platform && (
                                    <>
                                        <span> | </span>
                                        <span className={"text-md"}>Abfahrt von Gleis: {departure.platform}</span>
                                    </>
                                )}
                            </div>
                        </div>
                        <JourneyLeg journey={departure} showDetails openModal={openModal}/>
                    </div>
                ))}

                { !departureMode && (
                    <div className={"flex flex-row gap-2"}>
                        {routes && routes.earlierRef && (
                            <Button variant={"default"} className={"bg-pink-500 text-foreground hover:bg-pink-700"}
                                    onClick={handleEarlier} disabled={loading}>Früher</Button>
                        )}

                        {routes && routes.laterRef && (
                            <Button variant={"default"} className={"bg-pink-500 text-foreground hover:bg-pink-700"}
                                    onClick={handleLater} disabled={loading}>Später</Button>
                        )}
                    </div>
                )}
            </div>
        </>
    )
}

interface JourneyDetailsSectionProps {
    journeyWrapper: JourneyWrapper;
    toggle: () => void;
    isExpanded: boolean;
    openModal: (config: ModalConfig) => void;
}

const BooleanIcon = ({icon, bool, description}: { icon: React.ReactNode, bool: boolean, description: string }) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className={"flex flex-col justify-center items-center rounded-md bg-white/5 p-2"}>
                        <span className={cn(bool ? "text-green-500" : "text-red-500")}>
                            {icon}
                        </span>
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{description} {bool ? " vorhanden" : " nicht vorhanden"}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

const JourneyDetailsSection = ({journeyWrapper, toggle, isExpanded, openModal}: JourneyDetailsSectionProps) => {
    const handleBahnhofClicked = async (bhf: string) => {
        const bhfData: Bahnhof = await getStation(bhf);
        bhfData.hasElevator = bhfData.hasElevator || bhfData.hasSteplessAccess;
        if (bhfData) {
            openModal({
                title: `Bahnhof Details (${bhfData.name})`,
                content: (<>
                    <div className={"flex flex-col gap-1"}>
                        <span className={"text-white font-medium text-md"}>Nähere Informationen zum Bahnhof</span>
                        <div className={"flex flex-row gap-2"}>
                            <BooleanIcon icon={<ParkingCircle/>} bool={bhfData.hasParking} description={"Parkmöglichkeiten"}/>
                            <BooleanIcon icon={<BikeIcon/>} bool={bhfData.hasBicycleParking} description={"Fahrrad Stellplatz"}/>
                            <BooleanIcon icon={<Toilet/>} bool={bhfData.hasPublicFacilities} description={"Toiletten"}/>
                            <BooleanIcon icon={<CarTaxiFront/>} bool={bhfData.hasTaxiRank} description={"Taxis"}/>
                            <BooleanIcon icon={<Wheelchair/>} bool={bhfData.hasSteplessAccess} description={"Barrierefreier Zugang"}/>
                            <BooleanIcon icon={<WifiIcon/>} bool={bhfData.hasWiFi} description={"Kostenfreies WLAN"}/>
                            <BooleanIcon icon={<TrainIcon/>} bool={bhfData.hasTravelCenter} description={"Reisezentrum"}/>
                            <BooleanIcon icon={<CarIcon/>} bool={bhfData.hasCarRental} description={"Fahrzeugvermietung"}/>
                            <BooleanIcon icon={<Elevator/>} bool={bhfData.hasElevator} description={"Aufzüge"}/>
                        </div>
                    </div>
                </>)
            })
        }
    }

    return (
        <div className="flex flex-col rounded-lg shadow-md">
            <Button variant={"link"} onClick={toggle}>
                Details
            </Button>
            {isExpanded && (
                <div className="mt-4 space-y-4">
                    {journeyWrapper.legs.map((leg, index) => (
                        <div
                            className="flex flex-row gap-4 items-center p-3 bg-white/5 rounded-lg shadow-sm border transition-all duration-200"
                            key={index}
                        >
              <span className="text-sky-200 font-medium">{leg.line != undefined ? leg.line.name : "🚶"}</span>
                            <span className="flex-1 text-gray-700">
                                <Button variant={"link"} onClick={() => handleBahnhofClicked(leg.origin.id)}>{leg.origin.name}</Button>
                                -
                                <Button variant={"link"} onClick={() => handleBahnhofClicked(leg.destination.id)}>{leg.destination.name}</Button>
                                {leg.line != undefined && (
                                    <>
                                        -
                                        <span className={"text-primary px-4 font-md"}>Gleis: {leg.departurePlatform}</span>
                                    </>
                                )}
                            </span>
                            <span className="text-gray-500 text-sm">{formatTimeFromDateString(leg.departure)} -{" "}{formatTimeFromDateString(leg.arrival)}</span>
                            <span className="text-green-400 font-medium text-sm">{calculateTimeDifference(leg.departure, leg.arrival)}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

interface JourneyLegProps {
    journey: Journey;
    showDetails?: boolean;
    openModal?: (config: ModalConfig) => void;
}

const JourneyLeg: React.FC<JourneyLegProps> = ({ journey, showDetails, openModal }) => {

    const handleBahnhofClicked = async (bhf: string) => {
        const bhfData: Bahnhof = await getStation(bhf);
        bhfData.hasElevator = bhfData.hasElevator || bhfData.hasSteplessAccess;
        if (bhfData && openModal) {
            openModal({
                title: `Bahnhof Details (${bhfData.name !== undefined ? bhfData.name : "Unbekannt"})`,
                content: (<>
                    <div className={"flex flex-col gap-1"}>
                        {bhfData.name !== undefined ? (
                            <>
                                <span
                                    className={"text-white font-medium text-md"}>Nähere Informationen zum Bahnhof</span>
                                <div className={"flex flex-row gap-2"}>
                                    <BooleanIcon icon={<ParkingCircle/>} bool={bhfData.hasParking}
                                                 description={"Parkmöglichkeiten"}/>
                                    <BooleanIcon icon={<BikeIcon/>} bool={bhfData.hasBicycleParking}
                                                 description={"Fahrrad Stellplatz"}/>
                                    <BooleanIcon icon={<Toilet/>} bool={bhfData.hasPublicFacilities}
                                                 description={"Toiletten"}/>
                                    <BooleanIcon icon={<CarTaxiFront/>} bool={bhfData.hasTaxiRank}
                                                 description={"Taxis"}/>
                                    <BooleanIcon icon={<Wheelchair/>} bool={bhfData.hasSteplessAccess}
                                                 description={"Barrierefreier Zugang / Aufzug"}/>
                                    <BooleanIcon icon={<WifiIcon/>} bool={bhfData.hasWiFi}
                                                 description={"Kostenfreies WLAN"}/>
                                    <BooleanIcon icon={<TrainIcon/>} bool={bhfData.hasTravelCenter}
                                                 description={"Reisezentrum"}/>
                                    <BooleanIcon icon={<CarIcon/>} bool={bhfData.hasCarRental}
                                                 description={"Fahrzeugvermietung"}/>
                                    <BooleanIcon icon={<Elevator/>} bool={bhfData.hasElevator} description={"Aufzüge"}/>
                                </div>
                            </>
                        ) : (<>
                            <span className={"text-white font-medium text-md"}>Keine Informationen zum Bahnhof</span>
                            </>
                        )}

                    </div>
                </>)
            })
        }
    }

    return (
        <div className="w-full p-2 shadow rounded-lg">
            <div
                className={cn("mx-4 items-center bg-gray-700 text-white rounded-lg px-2 py-1", showDetails ? "grid grid-cols-3" : "flex flex-row justify-center")}>
                {showDetails && (<StopBtn hBC={handleBahnhofClicked} journey={journey}/>)}
                <span
                    className="font-semibold text-xs text-center">{journey.line != undefined ? journey.line.name : "🚶"}</span>
                {showDetails && (<StopBtnA hBC={handleBahnhofClicked} journey={journey}/>)}
            </div>
        </div>
    );
};

const StopBtn = ({journey, hBC}: { journey: Journey, hBC: (bhf: string) => void }) => (
    <>{journey.stop.id !== null ? (
        <Button variant={"link"} onClick={async () => await hBC(journey.stop.id)}>{journey.stop.name}</Button>
    ) : (
        <span>{journey.stop.name}</span>
    )}</>
)

const StopBtnA = ({journey, hBC}: { journey: Journey, hBC: (bhf: string) => void }) => (
    <>{journey.destination.id !== null ? (
        <Button variant={"link"} onClick={async () => await hBC(journey.destination.id)}>{journey.destination.name}</Button>
    ) : (
        <span>{journey.destination.name}</span>
    )}</>
)

interface JourneyWrapperProp {
    journeyWrapper: JourneyWrapper;
}

const JourneyRoute: React.FC<JourneyWrapperProp> = ({journeyWrapper}) => {
    return (
        <div className="flex flex-row gap-1 items-center">
            {journeyWrapper.legs.map((leg, index) => (
                <JourneyLeg key={index} journey={leg}/>
            ))}
        </div>
    );
};