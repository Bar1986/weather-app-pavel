const fs = require('fs')
const path = require('path')
const date = require('date')
const csvStringify = require('csv-stringify');
const moment = require('moment')



const writeToFile = async (data) => {
    try {

        csvStringify.stringify(data, { header: true }, (err, output) => {
            if (err) {
                throw new Error(err)
            }
            createDir()
            let dateFile = moment(new Date().toISOString()).format('YYYYMMDDhhmmss')

            console.log(dateFile)
            fs.writeFile(process.env.DIR_PATH + `/weather${dateFile}.csv`, output, (err) => {
                if (err) {
                    throw new Error(err)
                }
                console.log('my.csv saved.')
            })
        })
    } catch (e) {
        throw new Error('faild to save to CSV file')
    }

}
const createDir = () => {
    if (!fs.existsSync(process.env.DIR_PATH)) {
        fs.mkdirSync(process.env.DIR_PATH)
    }
}

module.exports = {
    writeToFile
}