"use server"
import {Bahnhof, Journey, JourneyResponse} from "@/lib/types/type";

/**
 * Ruft eine Liste von Bahnhöfen basierend auf einer Suchanfrage ab.
 *
 * @param query - Die Suchanfrage (z. B. Name des Bahnhofs).
 * @returns Eine Liste von Bahnhöfen mit ihren Eigenschaften oder eine Fehlermeldung.
 */
async function getStationsV2(query: string) {
    const primaryApiUrl = `https://v5.db.transport.rest/stations?query=${query}&limit=5&completion=true&fuzzy=true`;

    try {
        // Primärer API-Aufruf
        const primaryRes = await fetch(primaryApiUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        });

        console.log("Primärer API-Statuscode: " + primaryRes.status);

        if (!primaryRes.ok) {
            // Fehlerbehandlung, falls der API-Aufruf fehlschlägt
            return {
                error: true,
                message: `Anfrage fehlgeschlagen, versuche es später erneut. (${primaryRes.status})`,
            };
        }

        const finalResponse = await primaryRes.json();

        // Mapped die Daten in ein benutzerdefiniertes Format
        return Object.values(finalResponse).map((station: any) => {
            return {
                name: station.name,
                hasParking: station.hasParking ?? false,
                hasBicycleParking: station.hasBicycleParking ?? false,
                hasPublicFacilities: station.hasPublicFacilities ?? false,
                hasTaxiRank: station.hasTaxiRank ?? false,
                hasSteplessAccess: station.hasSteplessAccess ?? false,
                hasTravelNecessities: station.hasTravelNecessities ?? false,
                hasWiFi: station.hasWiFi ?? false,
                hasTravelCenter: station.hasTravelCenter ?? false,
                hasRailwayMission: station.hasRailwayMission ?? false,
                hasElevator: station.hasElevator ?? false,
                hasDBLounge: station.hasDBLounge ?? false,
                hasCarRental: station.hasCarRental ?? false,
                federalState: station.federalState ?? '',
                id: station.id ?? "", // Extrahiert die ID des Bahnhofs
            } as Bahnhof;
        });

    } catch (error) {
        console.error("Fehler während der API-Anfrage:", error);
        // Rückgabe einer Fehlermeldung
        return {
            error: true,
            message: "Ein Fehler ist beim Abrufen der Bahnhofsdaten aufgetreten.",
        };
    }
}

/**
 * Ruft die Details eines bestimmten Bahnhofs ab.
 *
 * @param id - Die eindeutige ID des Bahnhofs.
 * @returns Die Details des Bahnhofs oder ein leeres Objekt bei Fehler.
 */
async function getStation(id: string) {
    const apiUrl = `https://v5.db.transport.rest/stations/${id}`;
    const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        }
    });

    if (!response.ok) {
        return {}; // Gibt ein leeres Objekt zurück, falls die Anfrage fehlschlägt
    }

    return await response.json(); // Gibt die Bahnhofsdaten zurück
}

/**
 * Führt eine Anfrage nach einer Reise basierend auf den angegebenen Parametern aus.
 *
 * @param query - Der Query-String mit den Suchparametern.
 * @returns Die Antwort der API als JSON-Objekt.
 */
async function getJourney(query: string) {
    const apiUrl = `https://v5.db.transport.rest/journeys?${query}`;
    console.log("Anfrage für '" + apiUrl + "'");
    const res = await fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        }
    });

    if (!res.ok) {
        return {}; // Gibt ein leeres Objekt zurück, falls die Anfrage fehlschlägt
    }

    return await res.json(); // Gibt die Reisedaten zurück
}

/**
 * Ruft Reisen ab, die vor einer bestimmten Referenzzeit starten.
 *
 * @param from - Der Startbahnhof.
 * @param to - Der Zielbahnhof.
 * @param ref - Die Referenzzeit in ISO-Format.
 * @returns Eine Liste von Reisen, die vor der Referenzzeit starten.
 */
async function getJourneyByEarlierThan(from: string, to: string, ref: string) {
    const encodedRef = encodeURIComponent(ref);
    const query = `from=${from}&to=${to}&earlierThan=${encodedRef}`;
    const data: JourneyResponse = await getJourney(query);
    return data;
}

/**
 * Ruft Reisen ab, die nach einer bestimmten Referenzzeit starten.
 *
 * @param from - Der Startbahnhof.
 * @param to - Der Zielbahnhof.
 * @param ref - Die Referenzzeit in ISO-Format.
 * @returns Eine Liste von Reisen, die nach der Referenzzeit starten.
 */
async function getJourneyByLaterThan(from: string, to: string, ref: string) {
    const encodedRef = encodeURIComponent(ref);
    const query = `from=${from}&to=${to}&laterThan=${encodedRef}`;
    const data: JourneyResponse = await getJourney(query);
    return data;
}

/**
 * Ruft Reisen mit einer bestimmten Abfahrtszeit ab.
 *
 * @param from - Der Startbahnhof.
 * @param to - Der Zielbahnhof.
 * @param departure - Die Abfahrtszeit als Date-Objekt.
 * @returns Eine Liste von Reisen mit der angegebenen Abfahrtszeit.
 */
async function getJourneyWithDepature(from: string, to: string, departure: Date) {
    const formattedDeparture = departure.toISOString(); // Konvertiert Datum in ISO 8601-Format
    const query = `from=${from}&to=${to}&departure=${formattedDeparture}`;
    const data: JourneyResponse = await getJourney(query);
    return data;
}

/**
 * Ruft die Abfahrten eines bestimmten Bahnhofs zu einer bestimmten Zeit ab.
 *
 * @param station - Die ID des Bahnhofs.
 * @param depa - Die Abfahrtszeit als Date-Objekt.
 * @returns Eine Liste der Abfahrten von diesem Bahnhof.
 */
async function getStationsDepatures(station: string, depa: Date) {
    const departure = depa.toISOString(); // Konvertiert Datum in ISO 8601-Format
    const apiUrl = `https://v5.db.transport.rest/stops/${station}/departures?results=5&when=${departure}`;
    const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        }
    });

    let data: Journey[] = await response.json();

    if (!response.ok) {
        data = [] as Journey[]; // Gibt eine leere Liste zurück, falls die Anfrage fehlschlägt
    }

    return data; // Gibt die Abfahrtsdaten zurück
}

// Exportiert alle Funktionen für die Verwendung in anderen Modulen
export {getJourneyWithDepature, getJourneyByEarlierThan, getJourneyByLaterThan, getStation, getStationsDepatures, getStationsV2};
