const doRequest = require('../promises/requestPromise')
const lodash = require("lodash")
const getCoordinates = async (city)=>{
    try{               
            let url = process.env.GEO_URL
            url += encodeURIComponent(city) + `&limit=1&appid=${process.env.API_KEY}`
            const response = await doRequest(url)
            const currentCity = {
                city,
                latitude:response[0].lat,
                longtitue : response[0].lon
            }
           return currentCity   
    }catch(e){
        throw new Error(e.message)
    }
}
const latestForecast = async (city) => {
    try{
        let url = process.env.FORECAST_URL
        
        
        url +=`lat=${city.latitude}&lon=${city.longtitue}&appid=${process.env.API_KEY}`
        const response = await doRequest(url)
        let isRain = false
        let rainyDays = response.list.filter((rain) => rain.weather.main !== 'Rain')
        if(rainyDays.length !== 0){
             isRain = true
             
            

        }
        const sortedForecast = lodash.sortBy(response.list,(m)=>{
            return m.main.temp
        })
        const tempature = {
            warmestTempature : sortedForecast[sortedForecast.length -1].main.temp,
            warmestDay : sortedForecast[sortedForecast.length -1].dt_txt,
            coldestTemature : sortedForecast[0].main.temp,
            coldestDay : sortedForecast[0].dt_txt,
            isRain
        }
        city.tempature = tempature
        return city
    }catch(e){
        throw new Error(e.message)
    }
}
const getWarmestCity = async(cityList)=>{
    try{
        let warmestCity =  cityList.reduce((highestX,highestY)=>(highestX.tempature.warmestTempature > highestY.tempature.warmestTempature) ? highestX : highestY)
        warmestCity= {
            day : warmestCity.tempature.warmestDay,
            city :warmestCity.city,
            rain : warmestCity.tempature.isRain.toString(),
            tempature : warmestCity.tempature.warmestTempature
        }
        return warmestCity
    }catch(e){
        throw new Error(e.message)
    }


}
const getColdestCity = async(cityList)=>{
    try {
        const sortArr = lodash.sortBy(cityList,(coldest)=>{
            return coldest.tempature.coldestTemature
        })
        let coldestCity = sortArr[0]
         coldestCity = {
            day : coldestCity.tempature.coldestDay,
            city :coldestCity.city,
            rain : coldestCity.tempature.isRain.toString(),
            tempature : coldestCity.tempature.coldestTemature
        }
        return coldestCity
    }catch(e){
        throw new Error(e.message)
    }

}
const getCitiesWithRain = async(cityList)=>{
    try{

        let cities = cityList.map(city =>{
            if(city.tempature.isRain === true){
                return {
                    day: city.tempature.warmestDay,
                    city : city.city,
                    rain : 'true',
                    tempature : city.tempature.warmestTempature
                }
            }          
        })

        return cities
    }catch(e){
        throw new Error(e.message)
    }
}
module.exports = {
    getCoordinates,
    latestForecast,
    getWarmestCity,
    getColdestCity,
    getCitiesWithRain
}