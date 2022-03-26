const axios = require("axios").default;
const APIKey = require("./config").openWeatherMapAPIKey;

/**
 * forecast
 * : get a Promise object resolved with an object that contains the weather data for given latitude and longitude
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise<object>} forecastPromise
 */
async function forecast(latitude, longitude) {
    const forecastPromise = new Promise(async (resolve, reject) => {
        if (
            !latitude ||
            !longitude ||
            typeof latitude != "number" ||
            typeof longitude != "number"
        ) {
            reject(new Error("Invalid input"));
        }

        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${APIKey}`;

        try {
            const response = await axios.get(url);
            //error handling for bad response, when the user Input is wrong/bad
            if (response.data.cod === "400") {
                reject(new Error(reponse.data.message));
            }

            // No error
            const forecastData = {
                temperature: response.data.main.temp,
                feels_like: response.data.main.feels_like,
                description: response.data.weather[0].description,
                exact_location: response.data.name,
            };
            resolve(forecastData);
        } catch (error) {
            // error handling for physical/system errors. Eg: internet failure
            if (error.code === "ENOTFOUND") {
                reject(
                    new Error(
                        "Cannot connect to the forecast service. Make sure you're connected to the internet."
                    )
                );
            }
            reject(new Error(error.message));
        }
    });

    return forecastPromise;
}

/*
example use of forecast()
forecast(28.3949, 84.1240)
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.log(error.message);
    })
*/

module.exports = {
    forecast,
};
