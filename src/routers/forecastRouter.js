const express = require('express')
const lodash = require("lodash")
const forecast = require('../utils/forecast')
const {writeToFile} = require('../utils/file-io')
const router = express.Router()

let dataToExport = [] 



router.get('/weather',async(req,res)=>{
    try{ 
        let citiesLst = []

        const cities = req.query.city.map(async(cityName)=>{
            currentCity = await forecast.latestForecast(cityName)
            console.log(currentCity)
           citiesLst.push(currentCity)      
        });
        
        await Promise.all(cities)
        // const warmestCity = await forecast.getWarmestCity(citiesLst)
        // addTodata(warmestCity)
        // const coldestCity = await forecast.getColdestCity(citiesLst)
        // addTodata(coldestCity)
        // citiesWithRain = await forecast.getCitiesWithRain(citiesLst)
        // if(citiesWithRain.length !== 0){
        //     citiesWithRain.forEach(currentCity => addTodata(currentCity))           
        // }
       
        
        // await writeToFile(dataToExport)
        // res.send(citiesLst)

    }catch(e){
        res.status(400).send(e.message)
    }

    
})

const addTodata = (city)=> {    
    dataToExport.push(city)
}
module.exports = router