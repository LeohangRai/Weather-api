const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const APIKey = require('./config').mapBoxAPIKey


/**
 * geocode
 * : get a Promise object resolved with an object that contains the geocode of given location 
 * @param {string} address 
 * @returns {Promise<object>} geocodePromise
 */
async function geocode(address) {

    const geocodePromise = new Promise(async (resolve, reject) => {
    
        if(!address || typeof address != 'string' )
            reject(new Error('Invalid Input'))

        const addressEncoded = encodeURIComponent(address)
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${addressEncoded}.json?access_token=${APIKey}`
        
        fetch(url)
            .then(rawResponse => {
                return rawResponse.json();
            })
            .then(response => {
                //error handling for bad response, when the user Input is wrong/bad
                if (!response.features || response.features.length === 0){
                    reject(new Error("Oops! Did you type the name of your location properly? Try again please."))
                }
                //No error
                //Grabbing the latitude, longitude and location values from the JSON response coming through the API
                const geocodeData = {
                    latitude: response.features[0].center[1],
                    longitude: response.features[0].center[0],
                    location: response.features[0].place_name
                }
                resolve(geocodeData)
            })
                
            .catch(error => {
                // error handling for physical/system errors. Eg: internet failure
                if(error.code === 'ENOTFOUND') {
                    reject(new Error("Cannot connect to the geocode service. Make sure you're connected to the internet."))
                }
                reject(new Error(error.message));  
            })               
    })

    return geocodePromise;
}

/*
example use of geocode()
geocode('Nepal')
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.log(error.message);
    })
*/

module.exports = { 
    geocode
}