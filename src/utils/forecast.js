const doRequest = require('../promises/requestPromise')
const lodash = require("lodash")
const axios = require('axios')
const moment = require('moment')
let url = process.env.FORECAST_URL
const latestForecast = async (city) => {
    try {

        const response = await axios.get(`${url}&q=${city}&appid=${process.env.API_KEY}`)

        weatherItems = groupedWeather(response.data)

        city = {
            tempatures: weatherItems
        }
        return city
    } catch (e) {
        throw new Error(`faild to fetch forcecast of ${city}`)
    }
}
const getWarmestCityByDay = function (concatWeatherList) {
    let warmestDays = []
    concatWeatherList.forEach(w => {
        let dayIndex = concatWeatherList.filter((item) => { return item.day === w.day });
        let warmestCity = dayIndex.reduce((a, b) => {
            return (a.maxTempature > b.maxTempature ? a : b)
        });
        warmestDays.push(warmestCity);
    });
    //remove duplicates
    warmestDays = warmestDays.filter((item, pos) => {
        return warmestDays.indexOf(item) == pos
    });
    return warmestDays;
}
const getColdestCityByDay = function (concatWeatherList) {
    let coldestDays = []
    concatWeatherList.forEach(w => {
        let dayIndex = concatWeatherList.filter((item) => { return item.day === w.day });
        let coldestCity = dayIndex.reduce((a, b) => {
            return (a.minTempature < b.minTempature ? a : b)
        });
        coldestDays.push(coldestCity);
    });
    //remove duplicates
    let coldestDaysFitered = coldestDays.filter((item, pos) => {
        return coldestDays.indexOf(item) == pos
    });
    return coldestDaysFitered;
}
const getRainyCityByDay = function (concatWeatherList) {

    return concatWeatherList.filter(rain => rain.isRain === true)
}
const groupedWeather = function (response) {
    let weatherArr = []
    let weatherList = response.list
    weatherList.forEach(w => {
        let isRain = false
        if (w.dt_txt) {

            isRain = (w.weather[0].main === 'Rain')

            let currentDay = moment(w.dt_txt).format('YYYYMMDD')
            let weatherItem = weatherArr.filter((item, index) => {
                if (item.day === currentDay) {
                    weatherArr[index].isRain = (isRain || item.isRain);
                    weatherArr[index].maxTempature = (w.main.temp > item.maxTempature) ? w.main.temp : item.maxTempature;
                    weatherArr[index].minTempature = (w.main.temp < item.minTempature) ? w.main.temp : item.minTempature
                    weatherArr[index].city = response.city.name
                    return item
                }

            });
            if (weatherItem.length === 0) {
                weatherArr.push({
                    day: currentDay,
                    maxTempature: w.main.temp,
                    minTempature: w.main.temp,
                    isRain: isRain,
                    city: response.city.name
                });
            }
        }
    });
    return weatherArr

}

const summaryForecast = async (cityList) => {
    const summaryList = []
    const concatWeatherList = combiedTempsList(cityList)
    const warmestDays = getWarmestCityByDay(concatWeatherList)
    const coldestDays = getColdestCityByDay(concatWeatherList)
    const rainyDays = getRainyCityByDay(concatWeatherList)

    summaryList.push({
        warmestDays: warmestDays,
        coldestDays: coldestDays,
        rainyDays: rainyDays
    })

    return summaryList

}
const combiedTempsList = function (weatherList) {
    const concatWeatherList = weatherList.reduce((a, b) => {
        let aTemps = a.tempatures
        let bTemps = b.tempatures
        return aTemps.concat(bTemps)
    });
    const sortedWeatherList = concatWeatherList.sort((a, b) => {
        return a.day - b.day
    });
    return sortedWeatherList
}
module.exports = {
    latestForecast,
    summaryForecast,
}