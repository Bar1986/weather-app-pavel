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
           citiesLst.push(currentCity)      
        });
        
        await Promise.all(cities)
        
         const summary = await forecast.summaryForecast(citiesLst)
         await writeToFile(summary)
         res.send(summary)       

    }catch(e){
        res.status(400).send(e.message)
    }

    
})

const addTodata = (city)=> {    
    dataToExport.push(city)
}
module.exports = router