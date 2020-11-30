const request = require('request')

const geocode = (address, callback) => {
    const encoded_addr = encodeURIComponent(address)
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encoded_addr}.json?access_token=pk.eyJ1IjoiYXJuYXZndW5ldGEiLCJhIjoiY2tmNTFiaW53MGk3czJ3a3VlbmRlc2xvOCJ9.ep1q4ZAFj09lG4YjF-RsEA&limit=1`
    request({ url, json: true }, (error, {body}) => {
        if (error) {
            callback('Unable to connect to location services!')
        } else if (body.features.length === 0) {
            callback('Unable to find location!')
        } else {
            callback(undefined, {
                longitude: body.features[0].center[0],
                latitude: body.features[0].center[1],
                location: body.features[0].place_name
            })
        }
    })
}

module.exports = geocode