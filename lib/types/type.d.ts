export interface StationsResponse {
    offset: number,
    limit: number,
    total: number,
    result: Bahnhof[]
}

export interface Bahnhof {
    name: string;
    hasParking: boolean,
    hasBicycleParking: boolean,
    hasPublicFacilities: boolean,
    hasTaxiRank: boolean,
    hasSteplessAccess: boolean,
    hasTravelNecessities: boolean,
    hasWiFi: boolean,
    hasTravelCenter: boolean,
    hasRailwayMission: boolean,
    hasDBLounge: boolean,
    hasCarRental: boolean,
    federalState: string,
    evaNumbers: BahnhofEvaNumber[],

}

export interface BahnhofEvaNumber {
    number: number;
    isMain:boolean
}

export interface JourneyResponse {
    earlierRef: string,
    laterRef: string,
    journeys: JourneyWrapper[];
    realTimeDataFrom: number;
}

export interface JourneyWrapper {
    type: string;
    legs: Journey[];
    refreshToken: string;
}

export interface Journey {
    departure: string;
    plannedDeparture: string;
    departureDelay: number,
    arrival: string;
    plannedArrival: string;
    arrivalDelay: number;
    line: JourneyTrainData;
    direction: string;
    arrivalPlatform: string;
    plannedArrivalPlatform: string;
    departurePlatform: string;
    plannedDeparturePlatform: string;
    origin: JourneyStation;
    destination: JourneyStation;
}

export interface JourneyTrainData {
    type: string;
    id: string;
    name: string;
    public: boolean;
    productName: string;
    mode: string;
    product: string;
    additionalName: string;
}

export interface JourneyStation {
    type: string;
    id: string;
    name: string;
}