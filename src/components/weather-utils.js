export function SuffixforDate(date_data){
    const date = new Date(date_data);
    const day = date.getDate();
    const month = date.getMonth();

    const monthNames = [

        "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    let suffix = "th";
    if (day == 1 || day == 21 || day == 31){suffix = "st";}
    else if (day == 2 || day == 22) {suffix = "nd";}
    else if (day == 3 || day == 23) {suffix = "rd";}

    return `${monthNames[month]} ${day}${suffix}`


}


export function windDirectionInText (wind_dir) {
    const directions = [
        { range: [0, 22.5], direction: 'NORTH' },
        { range: [22.5, 67.5], direction: 'NORTH EAST' },
        { range: [67.5, 112.5], direction: 'EAST' },
        { range: [112.5, 157.5], direction: 'SOUTH EAST' },
        { range: [157.5, 202.5], direction: 'SOUTH' },
        { range: [202.5, 247.5], direction: 'SOUTH WEST' },
        { range: [247.5, 292.5], direction: 'WEST' },
        { range: [292.5, 337.5], direction: 'NORTH WEST' },
        { range: [337.5, 360], direction: 'NORTH' }
    ];

    for (let i = 0; i < directions.length; i++) {
        if (wind_dir >= directions[i].range[0] && wind_dir < directions[i].range[1]) {
            return directions[i].direction;
        }
    }
    return 'Unknown'; 
}


export function weatherType(weather_code) {
    const weatherCodes = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Cloudy',
        45: 'Fog',
        48: 'Depositing rime fog',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Heavy drizzle',
        56: 'Light freezing drizzle',
        57: 'Heavy freezing drizzle',
        61: 'Light rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        66: 'Light freezing rain',
        67: 'Heavy freezing rain',
        71: 'Light snow',
        73: 'Moderate snow',
        75: 'Heavy snow',
        77: 'Snow grains',
        80: 'Light rain showers',
        81: 'Moderate rain showers',
        82: 'Heavy rain showers',
        85: 'Light snow showers',
        86: 'Heavy snow showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with light hail',
        99: 'Thunderstorm with heavy hail'
    };
    if (weather_code in weatherCodes) {
        return weatherCodes[weather_code];
    } else {
        return 'Unknown weather code';
    }


}

