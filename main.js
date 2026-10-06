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

// IMPORTANT:
// Generate a NEW API key because the previous key
// was exposed publicly.
const OPENWEATHERMAP_API_KEY = 'b08af64dcf9354f4c07f28e924843e4c';


// ==========================================
// GLOBAL VARIABLES
// ==========================================

let clockInterval;


// ==========================================
// HELPER FUNCTIONS
// ==========================================

function showLoading() {
    loading.style.display = 'flex';
    weatherContainer.style.display = 'none';

    if (errorMessage) {
        errorMessage.style.display = 'none';
    }
}


function hideLoading() {
    loading.style.display = 'none';
    weatherContainer.style.display = 'block';
}


function showError(message) {
    loading.style.display = 'none';
    weatherContainer.style.display = 'none';

    if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }
}


function roundTemperature(temp) {
    return Math.round(temp);
}


// ==========================================
// INDIA TIMEZONE
// ==========================================

// India Standard Time
const INDIA_TIMEZONE = 'Asia/Kolkata';


// ==========================================
// GET INDIA CURRENT TIME
// ==========================================

function updateLiveClock() {

    const now = new Date();


    // ======================================
    // TIME
    // ======================================

    const timeFormatter =
        new Intl.DateTimeFormat('en-IN', {
            timeZone: INDIA_TIMEZONE,
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });


    currentTime.textContent =
        timeFormatter.format(now);


    // ======================================
    // DATE
    // ======================================

    const dateFormatter =
        new Intl.DateTimeFormat('en-IN', {
            timeZone: INDIA_TIMEZONE,
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });


    currentDate.textContent =
        dateFormatter.format(now);
}


// ==========================================
// START LIVE INDIA CLOCK
// ==========================================

function startLiveClock() {

    clearInterval(clockInterval);

    // Show immediately
    updateLiveClock();

    // Update every second
    clockInterval =
        setInterval(updateLiveClock, 1000);
}


// ==========================================
// CURRENT WEATHER
// ==========================================

function parseWeatherData(data) {

    if (data.cod !== 200) {

        throw new Error(
            data.message ||
            'Unable to get weather data.'
        );
    }


    // City

    cityName.textContent =
        data.name;


    // Weather icon

    currentTempIcon.src =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;


    currentTempIcon.alt =
        data.weather[0].description;


    // Description

    currentTempDesc.textContent =
        data.weather[0].description;


    // Current temperature

    currentTemp.textContent =
        `${roundTemperature(data.main.temp)}°C`;


    // Maximum temperature

    maxTemp.textContent =
        `H: ${roundTemperature(data.main.temp_max)}°C`;


    // Minimum temperature

    minTemp.textContent =
        `L: ${roundTemperature(data.main.temp_min)}°C`;


    // ======================================
    // START INDIA REAL-TIME CLOCK
    // ======================================

    startLiveClock();


    // ======================================
    // CHANGE BACKGROUND
    // ======================================

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


    fetch(url)

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    'Unable to fetch current weather.'
                );
            }

            return response.json();
        })

        .then(data => {

            parseWeatherData(data);

        })

        .catch(error => {

            console.error(error);

            showError(
                'Unable to load weather information. Please check your API key or internet connection.'
            );
        });
}


// ==========================================
// FORECAST DATA
// ==========================================

function parseForecastData(data) {

    forecastContainer.innerHTML = '';


    data.list.forEach(weatherInfo => {

        const forecastCard =
            document.createElement('div');

        forecastCard.className =
            'forecast-card';


        // ==================================
        // FORECAST TIME
        // ==================================

        const forecastTime =
            document.createElement('div');

        forecastTime.className =
            'forecast-time';


        const forecastDate =
            new Date(weatherInfo.dt * 1000);


        // Convert forecast UTC time to India time

        const forecastTimeFormatter =
            new Intl.DateTimeFormat('en-IN', {
                timeZone: INDIA_TIMEZONE,
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });


        forecastTime.textContent =
            forecastTimeFormatter.format(
                forecastDate
            );


        forecastCard.append(
            forecastTime
        );


        // ==================================
        // WEATHER ICON
        // ==================================

        const forecastIcon =
            document.createElement('img');

        forecastIcon.className =
            'forecast-icon';


        forecastIcon.src =
            `https://openweathermap.org/img/wn/${weatherInfo.weather[0].icon}@2x.png`;


        forecastIcon.alt =
            weatherInfo.weather[0].description;


        forecastCard.append(
            forecastIcon
        );


        // ==================================
        // DESCRIPTION
        // ==================================

        const forecastDesc =
            document.createElement('div');

        forecastDesc.className =
            'forecast-desc';


        forecastDesc.textContent =
            weatherInfo.weather[0].description;


        forecastCard.append(
            forecastDesc
        );


        // ==================================
        // TEMPERATURE
        // ==================================

        const forecastTemp =
            document.createElement('div');

        forecastTemp.className =
            'forecast-temp';


        forecastTemp.textContent =
            `${roundTemperature(weatherInfo.main.temp)}°C`;


        forecastCard.append(
            forecastTemp
        );


        forecastContainer.append(
            forecastCard
        );

    });
}


// ==========================================
// GET FORECAST
// ==========================================

function getForecastWeatherApi(city, lat, lon) {

    let url;


    if (city) {

        url =
            `https://api.openweathermap.org/data/2.5/forecast` +
            `?q=${encodeURIComponent(city)}` +
            `&appid=${OPENWEATHERMAP_API_KEY}` +
            `&units=metric` +
            `&cnt=4`;

    } else {

        url =
            `https://api.openweathermap.org/data/2.5/forecast` +
            `?lat=${lat}` +
            `&lon=${lon}` +
            `&appid=${OPENWEATHERMAP_API_KEY}` +
            `&units=metric` +
            `&cnt=4`;
    }


    fetch(url)

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    'Unable to fetch forecast.'
                );
            }

            return response.json();
        })

        .then(data => {

            parseForecastData(data);

            hideLoading();

        })

        .catch(error => {

            console.error(error);

            showError(
                'Unable to load forecast information.'
            );
        });
}


// ==========================================
// DYNAMIC BACKGROUND
// ==========================================

function changeWeatherBackground(
    weatherType,
    icon
) {

    const body =
        document.body;


    body.className = '';


    // Night weather

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


const city =
    params.get('city');


// ==========================================
// START INDIA CLOCK IMMEDIATELY
// ==========================================

// This means the clock works even before
// weather API responds.

startLiveClock();


// ==========================================
// GEOLOCATION
// ==========================================

if (navigator.geolocation) {

    navigator.geolocation.getCurrentPosition(

        position => {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;


            getCurrentWeatherApi(
                null,
                latitude,
                longitude
            );


            getForecastWeatherApi(
                null,
                latitude,
                longitude
            );

        },


        error => {

            console.log(
                'Location permission denied.'
            );


            getCurrentWeatherApi(
                city || 'Mumbai'
            );


            getForecastWeatherApi(
                city || 'Mumbai'
            );

        }

    );

} else {

    getCurrentWeatherApi(
        city || 'Mumbai'
    );


    getForecastWeatherApi(
        city || 'Mumbai'
    );
}