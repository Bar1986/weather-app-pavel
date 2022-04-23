const fs = require('fs')
const path = require('path')
const date = require('date')
const csvStringify  = require('csv-stringify');
const { trim } = require('lodash');
    


const writeToFile = async(data) =>{
   try{
    
    csvStringify.stringify(data,{header:true},(err,output)=>{
        if(err){
            throw new Error(err)
        }
        createDir()
        //let dateFile = new Date()
      //let file =   isFileExist() 
      let dateFile = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
      
        // "2022-04-23 07:56:17"
        dateFile = dateFile.replace(/\s+/g, '')
                   .replace(/-/g,'')
                   .replace(/:/g,'')
        console.log(dateFile)
        fs.writeFile(process.env.DIR_PATH+`/weather${dateFile}.csv`,output,(err)=>{
            if(err){
             throw new Error(err)
            }
            console.log('my.csv saved.')
        })
    })
   } catch(e){
       throw new Error(e.message)
   }

}
const createDir = ()=>{
    if(!fs.existsSync(process.env.DIR_PATH)){
        fs.mkdirSync(process.env.DIR_PATH)
    }
}

module.exports = {
    writeToFile
}