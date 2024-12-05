"use server"
import {Bahnhof, JourneyResponse, StationsResponse} from "@/lib/types/type";

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

async function getJourney(query: string) {
    const apiUrl = `https://v5.db.transport.rest/journeys?${query}`;
    const res = await fetch(apiUrl, {});

    if (!res.ok) {
        return {};
    }

    return await res.json();
}

async function getJourneyWithDepature(from: number, to: number, departure: Date) {
    const query = `from=${from}&to=${to}&departure=${departure}&limit=3`;
    const data: JourneyResponse = await getJourney(query);
    console.log(JSON.stringify(data));
    return data;
}

export {getStations, getJourneyWithDepature};