
const cityName = document.querySelector('.city-name');
const currentTempIcon = document.querySelector('.current-temp-icon');
const currentTemp = document.querySelector('.current-temp');
const currentTempDesc = document.querySelector('.current-temp-desc');
const maxTemp = document.querySelector('.max-temp');
const minTemp = document.querySelector('.min-temp');

const currentTime = document.querySelector('#current-time');
const currentDate = document.querySelector('#current-date');

const forecastContainer = document.querySelector('.forecast-container');

const loading = document.querySelector('#loading');
const weatherContainer = document.querySelector('#weather-container');
const errorMessage = document.querySelector('#error-message');


// ==========================================
// OPENWEATHERMAP API KEY
// ==========================================


const OPENWEATHERMAP_API_KEY = 'b08af64dcf9354f4c07f28e924843e4c';

// ==========================================
// GLOBAL VARIABLES
// ==========================================

let locationTimezoneOffset = 0;
let clockInterval;


// ==========================================
// HELPER FUNCTIONS
// ==========================================

function showLoading() {
    loading.style.display = 'flex';
    weatherContainer.style.display = 'none';
    errorMessage.style.display = 'none';
}


function hideLoading() {
    loading.style.display = 'none';
    weatherContainer.style.display = 'block';
}


function showError(message) {
    loading.style.display = 'none';
    weatherContainer.style.display = 'none';

    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}


function roundTemperature(temp) {
    return Math.round(temp);
}


// ==========================================
// FORMAT LIVE LOCAL TIME
// ==========================================

function getLocationDate(timezoneOffset) {

    const now = new Date();

    /*
        Convert browser time into UTC,
        then apply OpenWeatherMap timezone offset.
    */

    const utcTime =
        now.getTime() +
        (now.getTimezoneOffset() * 60 * 1000);

    return new Date(
        utcTime +
        (timezoneOffset * 1000)
    );
}


// ==========================================
// LIVE CLOCK WITH AM / PM
// ==========================================

function updateLiveClock() {

    const locationDate =
        getLocationDate(locationTimezoneOffset);

    let hours = locationDate.getUTCHours();

    const minutes =
        locationDate.getUTCMinutes();

    const seconds =
        locationDate.getUTCSeconds();

    const amPM =
        hours >= 12 ? 'PM' : 'AM';

    hours =
        hours % 12 || 12;

    currentTime.textContent =
        `${hours}:${minutes
            .toString()
            .padStart(2, '0')}:${seconds
            .toString()
            .padStart(2, '0')} ${amPM}`;


    // Date

    const days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ];

    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];

    const day =
        days[locationDate.getUTCDay()];

    const date =
        locationDate.getUTCDate();

    const month =
        months[locationDate.getUTCMonth()];

    const year =
        locationDate.getUTCFullYear();

    currentDate.textContent =
        `${day}, ${month} ${date}, ${year}`;
}


// ==========================================
// START LIVE CLOCK
// ==========================================

function startLiveClock(timezoneOffset) {

    locationTimezoneOffset =
        timezoneOffset || 0;

    clearInterval(clockInterval);

    updateLiveClock();

    clockInterval =
        setInterval(updateLiveClock, 1000);
}


// ==========================================
// CURRENT WEATHER
// ==========================================

function parseWeatherData(data) {

    if (data.cod !== 200) {
        throw new Error(
            data.message || 'Unable to get weather data.'
        );
    }

    cityName.textContent =
        data.name;

    currentTempIcon.src =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    currentTempDesc.textContent =
        data.weather[0].description;

    currentTemp.textContent =
        `${roundTemperature(data.main.temp)}°C`;

    maxTemp.textContent =
        `${roundTemperature(data.main.temp_max)}°C`;

    minTemp.textContent =
        `${roundTemperature(data.main.temp_min)}°C`;


    // Start clock using location timezone

    startLiveClock(data.timezone);


    // Change background according to weather

    changeWeatherBackground(
        data.weather[0].main,
        data.weather[0].icon
    );
}


// ==========================================
// GET CURRENT WEATHER
// ==========================================

function getCurrentWeatherApi(city, lat, lon) {

    showLoading();

    let url;

    if (city) {

        url =
            `https://api.openweathermap.org/data/2.5/weather` +
            `?q=${encodeURIComponent(city)}` +
            `&appid=${OPENWEATHERMAP_API_KEY}` +
            `&units=metric`;

    } else {

        url =
            `https://api.openweathermap.org/data/2.5/weather` +
            `?lat=${lat}` +
            `&lon=${lon}` +
            `&appid=${OPENWEATHERMAP_API_KEY}` +
            `&units=metric`;
    }


=======
// ==========================================
// OpenWeatherMap API Key
// ==========================================

const OPENWEATHERMAP_API_KEY = 'YOUR_API_KEY';


// ==========================================
// Format Local Time
// ==========================================

function formatForecastTime(timestamp, timezoneOffset) {

    // Convert Unix timestamp to milliseconds
    const utcTime = timestamp * 1000;

    // Add city's timezone offset
    const localTime = new Date(
        utcTime + (timezoneOffset * 1000)
    );

    let hours = localTime.getUTCHours();
    const minutes = localTime.getUTCMinutes();

    const amPm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;

    if (hours === 0) {
        hours = 12;
    }

    const formattedMinutes =
        minutes.toString().padStart(2, '0');

    return `${hours}:${formattedMinutes} ${amPm}`;
}


// ==========================================
// Current Weather
// ==========================================

function parseWeatherData(data) {

    cityName.textContent = data.name;

    currentTempIcon.src =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    currentTempIcon.alt =
        data.weather[0].description;

    currentTemp.textContent =
        `${Math.round(data.main.temp)}°C`;

    currentTempDesc.textContent =
        data.weather[0].description;

    maxTemp.textContent =
        `H: ${Math.round(data.main.temp_max)}°C`;

    minTemp.textContent =
        `L: ${Math.round(data.main.temp_min)}°C`;
}


// ==========================================
// Current Weather API
// ==========================================

function getCurrentWeatherApi(city, lat, lon) {

    loading.style.display = 'block';
    weatherContainer.style.display = 'none';

    let url;

    if (city) {

        url =
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`;

    } else {

        url =
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`;
    }

>>>>>>> 153e17b6bc209a1f02cf26790dd518ed1bb15287
    fetch(url)

        .then(response => {

            if (!response.ok) {
<<<<<<< HEAD
                throw new Error(
                    'Unable to fetch current weather.'
                );
            }

            return response.json();
=======
                throw new Error('Unable to fetch weather data.');
            }

            return response.json();

>>>>>>> 153e17b6bc209a1f02cf26790dd518ed1bb15287
        })

        .then(data => {

<<<<<<< HEAD
=======
            if (data.cod !== 200) {
                throw new Error(data.message);
            }

>>>>>>> 153e17b6bc209a1f02cf26790dd518ed1bb15287
            parseWeatherData(data);

        })

        .catch(error => {

<<<<<<< HEAD
            console.error(error);

            showError(
                'Unable to load weather information. Please check your API key or internet connection.'
            );

=======
            console.error('Current Weather Error:', error);

            alert(
                'Unable to load weather information. Please try again.'
            );

        })

        .finally(() => {

            loading.style.display = 'none';
            weatherContainer.style.display = 'block';

>>>>>>> 153e17b6bc209a1f02cf26790dd518ed1bb15287
        });
}


// ==========================================
<<<<<<< HEAD
// FORECAST DATA
=======
// Forecast Data
>>>>>>> 153e17b6bc209a1f02cf26790dd518ed1bb15287
// ==========================================

function parseForecastData(data) {

    forecastContainer.innerHTML = '';

<<<<<<< HEAD

    data.list.forEach(weatherInfo => {

=======
    const timezoneOffset = data.city.timezone;

    data.list.forEach(weatherInfo => {

        // ------------------------------
        // Forecast Card
        // ------------------------------

>>>>>>> 153e17b6bc209a1f02cf26790dd518ed1bb15287
        const forecastCard =
            document.createElement('div');

        forecastCard.className =
            'forecast-card';


<<<<<<< HEAD
        // Forecast Time
=======
        // ------------------------------
        // Forecast Time
        // ------------------------------
>>>>>>> 153e17b6bc209a1f02cf26790dd518ed1bb15287

        const forecastTime =
            document.createElement('div');

        forecastTime.className =
            'forecast-time';

<<<<<<< HEAD

        const forecastDate =
            new Date(
                weatherInfo.dt * 1000
            );


        let hours =
            forecastDate.getUTCHours();

        const minutes =
            forecastDate.getUTCMinutes();

        const amPM =
            hours >= 12 ? 'PM' : 'AM';

        hours =
            hours % 12 || 12;


        forecastTime.textContent =
            `${hours}:${minutes
                .toString()
                .padStart(2, '0')} ${amPM}`;


        forecastCard.append(
=======
        forecastTime.textContent =
            formatForecastTime(
                weatherInfo.dt,
                timezoneOffset
            );

        forecastCard.appendChild(
>>>>>>> 153e17b6bc209a1f02cf26790dd518ed1bb15287
            forecastTime
        );


<<<<<<< HEAD
        // Weather Icon
=======
        // ------------------------------
        // Weather Icon
        // ------------------------------
>>>>>>> 153e17b6bc209a1f02cf26790dd518ed1bb15287

        const forecastIcon =
            document.createElement('img');

        forecastIcon.className =
            'forecast-icon';

        forecastIcon.src =
            `https://openweathermap.org/img/wn/${weatherInfo.weather[0].icon}@2x.png`;

        forecastIcon.alt =
            weatherInfo.weather[0].description;

<<<<<<< HEAD

        forecastCard.append(
=======
        forecastCard.appendChild(
>>>>>>> 153e17b6bc209a1f02cf26790dd518ed1bb15287
            forecastIcon
        );


<<<<<<< HEAD
        // Description
=======
        // ------------------------------
        // Weather Description
        // ------------------------------
>>>>>>> 153e17b6bc209a1f02cf26790dd518ed1bb15287

        const forecastDesc =
            document.createElement('div');

        forecastDesc.className =
            'forecast-desc';

        forecastDesc.textContent =
            weatherInfo.weather[0].description;

<<<<<<< HEAD

        forecastCard.append(
=======
        forecastCard.appendChild(
>>>>>>> 153e17b6bc209a1f02cf26790dd518ed1bb15287
            forecastDesc
        );


<<<<<<< HEAD
        // Temperature
=======
        // ------------------------------
        // Forecast Temperature
        // ------------------------------
>>>>>>> 153e17b6bc209a1f02cf26790dd518ed1bb15287

        const forecastTemp =
            document.createElement('div');

        forecastTemp.className =
            'forecast-temp';

        forecastTemp.textContent =
<<<<<<< HEAD
            `${roundTemperature(weatherInfo.main.temp)}°C`;


        forecastCard.append(
=======
            `${Math.round(weatherInfo.main.temp)}°C`;

        forecastCard.appendChild(
>>>>>>> 153e17b6bc209a1f02cf26790dd518ed1bb15287
            forecastTemp
        );


<<<<<<< HEAD
        forecastContainer.append(
=======
        // ------------------------------
        // Add Card
        // ------------------------------

        forecastContainer.appendChild(
>>>>>>> 153e17b6bc209a1f02cf26790dd518ed1bb15287
            forecastCard
        );

    });
}


// ==========================================
<<<<<<< HEAD
// GET FORECAST
=======
// Forecast API
>>>>>>> 153e17b6bc209a1f02cf26790dd518ed1bb15287
// ==========================================

function getForecastWeatherApi(city, lat, lon) {

    let url;

    if (city) {

        url =
<<<<<<< HEAD
            `https://api.openweathermap.org/data/2.5/forecast` +
            `?q=${encodeURIComponent(city)}` +
            `&appid=${OPENWEATHERMAP_API_KEY}` +
            `&units=metric` +
            `&cnt=4`;
=======
            `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${OPENWEATHERMAP_API_KEY}&units=metric&cnt=4`;
>>>>>>> 153e17b6bc209a1f02cf26790dd518ed1bb15287

    } else {

        url =
<<<<<<< HEAD
            `https://api.openweathermap.org/data/2.5/forecast` +
            `?lat=${lat}` +
            `&lon=${lon}` +
            `&appid=${OPENWEATHERMAP_API_KEY}` +
            `&units=metric` +
            `&cnt=4`;
    }


=======
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHERMAP_API_KEY}&units=metric&cnt=4`;
    }

>>>>>>> 153e17b6bc209a1f02cf26790dd518ed1bb15287
    fetch(url)

        .then(response => {

            if (!response.ok) {
<<<<<<< HEAD
                throw new Error(
                    'Unable to fetch forecast.'
                );
            }

            return response.json();
=======
                throw new Error('Unable to fetch forecast data.');
            }

            return response.json();

>>>>>>> 153e17b6bc209a1f02cf26790dd518ed1bb15287
        })

        .then(data => {

<<<<<<< HEAD
            parseForecastData(data);

            hideLoading();
=======
            if (data.cod !== '200' && data.cod !== 200) {
                throw new Error(data.message);
            }

            parseForecastData(data);
>>>>>>> 153e17b6bc209a1f02cf26790dd518ed1bb15287

        })

        .catch(error => {

<<<<<<< HEAD
            console.error(error);

            showError(
                'Unable to load forecast information.'
=======
            console.error(
                'Forecast Error:',
                error
>>>>>>> 153e17b6bc209a1f02cf26790dd518ed1bb15287
            );

        });
}


// ==========================================
<<<<<<< HEAD
// DYNAMIC BACKGROUND
// ==========================================

function changeWeatherBackground(
    weatherType,
    icon
) {

    const body =
        document.body;


    body.className = '';


    if (icon.includes('n')) {

        body.classList.add(
            'night'
        );

        return;
    }


    switch (weatherType) {

        case 'Clear':

            body.classList.add(
                'clear'
            );

            break;


        case 'Clouds':

            body.classList.add(
                'clouds'
            );

            break;


        case 'Rain':

        case 'Drizzle':

            body.classList.add(
                'rain'
            );

            break;


        case 'Thunderstorm':

            body.classList.add(
                'storm'
            );

            break;


        case 'Snow':

            body.classList.add(
                'snow'
            );

            break;


        default:

            body.classList.add(
                'default-weather'
            );
    }
}


// ==========================================
// URL CITY PARAMETER
// ==========================================

const params =
    new URL(document.location)
        .searchParams;
=======
// Get City From URL
// ==========================================

const params =
    new URL(window.location.href).searchParams;
>>>>>>> 153e17b6bc209a1f02cf26790dd518ed1bb15287

const city =
    params.get('city');


// ==========================================
<<<<<<< HEAD
// GEOLOCATION
=======
// Detect User Location
>>>>>>> 153e17b6bc209a1f02cf26790dd518ed1bb15287
// ==========================================

if (navigator.geolocation) {

    navigator.geolocation.getCurrentPosition(

        position => {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;

<<<<<<< HEAD
=======
            console.log(
                'Latitude:',
                latitude
            );

            console.log(
                'Longitude:',
                longitude
            );

>>>>>>> 153e17b6bc209a1f02cf26790dd518ed1bb15287

            getCurrentWeatherApi(
                null,
                latitude,
                longitude
            );

<<<<<<< HEAD

=======
>>>>>>> 153e17b6bc209a1f02cf26790dd518ed1bb15287
            getForecastWeatherApi(
                null,
                latitude,
                longitude
            );

        },

        error => {

<<<<<<< HEAD
            console.log(
                'Location permission denied.'
            );


            getCurrentWeatherApi(
                city || 'Mumbai'
            );


            getForecastWeatherApi(
                city || 'Mumbai'
=======
            console.warn(
                'Location permission denied.',
                error
            );

            const fallbackCity =
                city || 'Mumbai';

            getCurrentWeatherApi(
                fallbackCity
            );

            getForecastWeatherApi(
                fallbackCity
>>>>>>> 153e17b6bc209a1f02cf26790dd518ed1bb15287
            );

        }

    );

} else {

<<<<<<< HEAD
    getCurrentWeatherApi(
        city || 'Mumbai'
    );


    getForecastWeatherApi(
        city || 'Mumbai'
    );
}
=======
    const fallbackCity =
        city || 'Mumbai';

    getCurrentWeatherApi(
        fallbackCity
    );

    getForecastWeatherApi(
        fallbackCity
    );

}
```
>>>>>>> 153e17b6bc209a1f02cf26790dd518ed1bb15287
