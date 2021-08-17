// Fetch the data from the csv file
const getRunData = async (url) => {
    const response = await fetch(url);
    const data = await response.text();
    return data
}

const getMilestones = (data, threshold) => {
    const fiftyMiles = []
    let milestoneCount = 1
    let runTotal = 0

    for (let i = 0; i < data.length; i++) {
        runTotal = runTotal + data[i].value
        if (runTotal === threshold) {
            milestoneCount = milestoneCount + 1
            fiftyMiles.push({ 'date': data[i], 'miles': runTotal })
        } else if ((runTotal >= threshold * milestoneCount) && (milestoneCount != 0)) {
            milestoneCount = milestoneCount + 1
            fiftyMiles.push({ 'date': data[i], 'miles': runTotal })
        }
    }
    return fiftyMiles
}

// Where I save the csv data
const running_csv = "https://gist.githubusercontent.com/garyditsch/7e8b58555746148d10009f9954a9e690/raw/strava_run_data_2021.csv"
// https://gist.githubusercontent.com/garyditsch/7e8b58555746148d10009f9954a9e690/raw/d52398ff228567d16030e6a771c3bdd4dada1f89/strava_run_data_2021.csv
// const running_csv = "https://gist.githubusercontent.com/garyditsch/f24197477b181077c64bb3f6de034223/raw/all_strava.csv"


// map over the data and return a new array with just the formatted date and distance of the commute
// this format was utilized by the example I worked from would like to improve with additional data
// convert from km to miles
// TODO: bring in other data for additional data sources
const runDateValues = async (data) => data.map(dv => ({
    date: d3.timeDay(new Date(dv['Activity Date'])),
    value: Number(dv['Distance']) * 0.6213712,
    minutesOfDayStart: (((new Date(dv['Activity Date']).getHours() * 60) + (new Date(dv['Activity Date']).getMinutes()) - new Date(dv['Activity Date']).getTimezoneOffset()) / 60 ),
    speed: 60 / (dv["Average Speed"] * 2.2369)

}));

const theData = async (startDate, endDate) => {
    const data = await getRunData(running_csv)
    const parsedData = d3.csvParse(data);
    // console.log(parsedData)
    const dates = await runDateValues(parsedData)

    ed = new Date(endDate).getTime(),
    sd = new Date(startDate).getTime(),
    result = dates.filter(d => {
        var time = new Date(d.date).getTime();
        return (sd < time && time < ed);
    });
    return result
}