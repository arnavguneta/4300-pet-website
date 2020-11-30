const request = require('request')

const forecast = (latitude, longitude, callback) => {
    const url = `http://api.weatherstack.com/current?access_key=05185bc3c97d99fe902c5db60d5f1cc8&query=${latitude},${longitude}&units=f`
    request({ url, json: true }, (error, {body}) => {
        if (error) {
            callback('Unable to connect to forecast services!')
        } else if (body.error) {
            callback('Unable to find location!')
        } else {
            callback(undefined, `${body.current.weather_descriptions[0]}. It is currently ${body.current.temperature} degrees out. It feels like ${body.current.feelslike} degrees out. The humidity is ${body.current.humidity}%.`)
        }
    })
}

module.exports = forecast