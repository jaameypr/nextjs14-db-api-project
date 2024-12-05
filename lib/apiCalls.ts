"use server"
import {Journey, JourneyResponse, StationsResponse} from "@/lib/types/type";

const apiKey = 'b22ac08f332db7d99f1fa9769962ac0b'; // Replace with your actual client secret
const clientId = '06faa5610f6a93109a8a1e0bce36d678'; // Replace with your actual client ID

async function getStations(query: string) {
    const apiUrl = `https://apis.deutschebahn.com/db-api-marketplace/apis/station-data/v2/stations?searchstring=${query}*&logicaloperator=or&limit=5`;

    console.log("Request for " + apiUrl)

    const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
            'DB-Api-Key': apiKey,
            'DB-Client-Id': clientId,
        }
    });

    if (!response.ok) {
        return [];
    }

    const resData:StationsResponse = await response.json();
    return resData.result;
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

async function getJourneyByEarlierThan(from: number, to: number, ref: string) {
    const encodedRef = encodeURIComponent(ref);
    const query = `from=${from}&to=${to}&earlierThan=${encodedRef}`;
    const data: JourneyResponse = await getJourney(query);
    return data;
}

async function getJourneyByLaterThan(from: number, to: number, ref: string) {
    const encodedRef = encodeURIComponent(ref);
    const query = `from=${from}&to=${to}&laterThan=${encodedRef}`;
    const data: JourneyResponse = await getJourney(query);
    return data;
}

async function getJourneyWithDepature(from: number, to: number, departure: Date) {
    const formattedDeparture = departure.toISOString(); // Convert Date to ISO 8601 format
    const query = `from=${from}&to=${to}&departure=${formattedDeparture}`;
    const data: JourneyResponse = await getJourney(query);
    return data;
}

async function getStationsDepatures(station: number) {
    const apiUrl = `https://v5.db.transport.rest/stops/${station}/departures?results=5`;
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

export {getStations, getJourneyWithDepature, getJourneyByEarlierThan, getJourneyByLaterThan, getStation, getStationsDepatures};