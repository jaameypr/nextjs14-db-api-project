"use server"
import {Bahnhof, Journey, JourneyResponse} from "@/lib/types/type";

async function getStationsV2(query: string) {
    const api = `https://v5.db.transport.rest/stations?query=${query}&limit=5&completion=true&fuzzy=true`;
    const res = await fetch(api, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        }
    });

    if (!res.ok) {
        return [];
    }

    const data:Bahnhof[] = await res.json();

    return Object.values(data).map((station: Bahnhof) => {
        return {
            name: station.name,
            hasParking: station.hasParking ?? false,
            hasBicycleParking: station.hasBicycleParking ?? false,
            hasPublicFacilities: station.hasPublicFacilities ?? false,
            hasTaxiRank: station.hasTaxiRank ?? false,
            hasSteplessAccess: station.hasSteplessAccess ?? false, // This might need special handling if it's "yes"/"partial"
            hasTravelNecessities: station.hasTravelNecessities ?? false,
            hasWiFi: station.hasWiFi ?? false,
            hasTravelCenter: station.hasTravelCenter ?? false,
            hasRailwayMission: station.hasRailwayMission ?? false,
            hasDBLounge: station.hasDBLounge ?? false,
            hasCarRental: station.hasCarRental ?? false,
            federalState: station.federalState ?? '',
            id: station.id ?? "",
        } as Bahnhof;
    });
}

async function getStation(id: string) {
    const apiUrl = `https://v5.db.transport.rest/stations/${id}`;
    const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        }
    });

    if (!response.ok) {
        return {};
    }

    return await response.json();
}

async function getJourney(query: string) {
    const apiUrl = `https://v5.db.transport.rest/journeys?${query}`;
    console.log("Request for '" + apiUrl + "'")
    const res = await fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        }
    });

    if (!res.ok) {
        return {};
    }

    return await res.json();
}

async function getJourneyByEarlierThan(from: string, to: string, ref: string) {
    const encodedRef = encodeURIComponent(ref);
    const query = `from=${from}&to=${to}&earlierThan=${encodedRef}`;
    const data: JourneyResponse = await getJourney(query);
    return data;
}

async function getJourneyByLaterThan(from: string, to: string, ref: string) {
    const encodedRef = encodeURIComponent(ref);
    const query = `from=${from}&to=${to}&laterThan=${encodedRef}`;
    const data: JourneyResponse = await getJourney(query);
    return data;
}

async function getJourneyWithDepature(from: string, to: string, departure: Date) {
    const formattedDeparture = departure.toISOString(); // Convert Date to ISO 8601 format
    const query = `from=${from}&to=${to}&departure=${formattedDeparture}`;
    const data: JourneyResponse = await getJourney(query);
    return data;
}

async function getStationsDepatures(station: string, depa: Date) {
    const departure = depa.toISOString(); // Convert Date to ISO 8601 format
    const apiUrl = `https://v5.db.transport.rest/stops/${station}/departures?results=5&when=${departure}`;
    const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        }
    });

    let data: Journey[] = await response.json();

    if (!response.ok) {
        data = [] as Journey[];
    }

    return data;
}

export {getJourneyWithDepature, getJourneyByEarlierThan, getJourneyByLaterThan, getStation, getStationsDepatures, getStationsV2};