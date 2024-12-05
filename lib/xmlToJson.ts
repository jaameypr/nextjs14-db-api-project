const xmlToJson = (xmlString: string) => {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlString, "application/xml");

    const multipleStationData = xml.getElementsByTagName("station");

    let stations: any[] = [];

    // Loop through each 'station' element
    for (let i = 0; i < multipleStationData.length; i++) {
        const station = multipleStationData[i];

        const ds100 = station.getAttribute("ds100");
        const eva = station.getAttribute("eva");
        const meta = station.getAttribute("meta");
        const name = station.getAttribute("name");
        const p = station.getAttribute("p");

        // Push each station as an object into the stations array
        stations.push({
            ds100,
            eva,
            meta,
            name,
            p
        });
    }

    // Create final JSON structure
    const jsonResult = {
        multipleStationData: {
            station: stations
        }
    };

    return jsonResult;
};

export {xmlToJson};