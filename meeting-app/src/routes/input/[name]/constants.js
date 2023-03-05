export const PossibleLocations = ["SEC, Science Center, River, Quad, Off Campus"];

export const AvailabilityEnum = {
    Unavailable: 0,
    SEC: 1,
    ScienceCenter: 2,
    River: 3,
    Quad: 4,
    OffCampus: 5,
};

export const LocationColorMap = {
    0: "rgb(52, 152, 219)",
    1: "rgb(46, 204, 113)",
    2: "rgb(46, 204, 123)",
    3: "rgb(46, 204, 133)",
    4: "rgb(46, 204, 143)",
    5: "rgb(46, 204, 153)",
};

export const StringToLocationInteger = (rgb) => {
    if (rgb === LocationColorMap[0]) {
        return 0;
    } else if (rgb === LocationColorMap[1]) {
        return 1;
    } else if (rgb === LocationColorMap[2]) {
        return 2;
    } else if (rgb === LocationColorMap[3]) {
        return 3;
    } else if (rgb === LocationColorMap[4]) {
        return 4;
    } else if (rgb === LocationColorMap[5]) {
        return 5;
    } else {
        return 0;
    }
};

export const virtualColor = "rgb(52, 152, 219)";
export const inPersonColor = "rgb(46, 204, 113)";