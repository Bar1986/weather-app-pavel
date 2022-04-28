const doRequest = require('../promises/requestPromise')
const lodash = require("lodash")
const axios = require('axios')
const moment = require('moment')
let url = process.env.FORECAST_URL
const latestForecast = async (city) => {
    try {

        const response = await axios.get(`${url}&q=${city}&appid=${process.env.API_KEY}`)

        // const sortedForecast = lodash.sortBy(response.list,(m)=>{
        //     return m.main.temp
        // })
        // const tempature = {
        //     warmestTempature : sortedForecast[sortedForecast.length -1].main.temp,
        //     warmestDay : sortedForecast[sortedForecast.length -1].dt_txt,
        //     coldestTemature : sortedForecast[0].main.temp,
        //     coldestDay : sortedForecast[0].dt_txt,
        //     isRain
        // }
        // city.tempature = tempature
        weatherItems = groupedWeather(response.data.list)
        city = {
            city : city,
            tempatures : weatherItems
        }
        return city
    } catch (e) {
        throw new Error(e.message)
    }
}
const getWarmestCityByDay = async (cityList) => {
    try {
        let warmestCity = cityList.reduce((highestX, highestY) => (highestX.tempature.warmestTempature > highestY.tempature.warmestTempature) ? highestX : highestY)
        warmestCity = {
            day: warmestCity.tempature.warmestDay,
            city: warmestCity.city,
            rain: warmestCity.tempature.isRain.toString(),
            tempature: warmestCity.tempature.warmestTempature
        }
        return warmestCity
    } catch (e) {
        throw new Error(e.message)
    }


}
const getColdestCity = async (cityList) => {
    try {
        const sortArr = lodash.sortBy(cityList, (coldest) => {
            return coldest.tempature.coldestTemature
        })
        let coldestCity = sortArr[0]
        coldestCity = {
            day: coldestCity.tempature.coldestDay,
            city: coldestCity.city,
            rain: coldestCity.tempature.isRain.toString(),
            tempature: coldestCity.tempature.coldestTemature
        }
        return coldestCity
    } catch (e) {
        throw new Error(e.message)
    }

}

const groupedWeather = function (weatherList) {
    let weatherArr = []
    weatherList.forEach(w => {
        let isRain = false
        if (w.dt_txt) {

            isRain = (w.weather[0].main === 'Clouds')

            let currentDay = moment(w.dt_txt).format('YYYYMMDD')
            let weatherItem = weatherArr.filter((item,index) => {
                if(item.day === currentDay){
                    weatherArr[index].isRain = (isRain || item.isRain);
                    weatherArr[index].maxTempature = (w.main.temp > item.maxTempature ) ? w.main.temp : item.maxTempature;
                    weatherArr[index].minTempature = (w.main.temp< item.minTempature) ? w.main.temp : item.minTempature
                    return item
                }
                
            });
            if (weatherItem.length === 0) {
                weatherArr.push({
                    day: currentDay,
                    maxTempature: w.main.temp,
                    minTempature: w.main.temp,
                    isRain: isRain
                });
            }
        }
    });
    
    console.log(weatherArr)
    return weatherArr

}
module.exports = {
    latestForecast,
    getWarmestCity,
    getColdestCity,
    getCitiesWithRain
}