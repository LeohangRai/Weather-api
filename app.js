const { geocode } = require("./utils/geocode");
const { forecast } = require("./utils/forecast");

// promise consumption
getCurrentWeather("Kathmandu")
    .then((forecastData) => {
        console.log(forecastData);
    })
    .catch((error) => {
        console.log(error.message);
    });

/**
 * getCurrentWeather
 * : get a Promise object resolved with an object that contains the current weather data of any location.
 * Use city name instead of country name for more accurate data.
 * @param {string} location
 * @returns {Promse<object>} currentWeatherPromise
 */
async function getCurrentWeather(location) {
    const currentWeatherPromise = new Promise(async (resolve, reject) => {
        if (!location || typeof location != "string") {
            reject(new Error("Invalid input."));
        }

        try {
            const geocodeData = await geocode(location);
            const codedLocation = geocodeData.location;
            const forecastData = await forecast(
                geocodeData.latitude,
                geocodeData.longitude
            );
            forecastData["location"] = codedLocation;
            resolve(forecastData);
        } catch (error) {
            reject(new Error(error.message));
        }
    });

    return currentWeatherPromise;
}

module.exports = {
    getCurrentWeather,
};
