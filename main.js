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

<<<<<<< HEAD
=======
const OPENWEATHERMAP_API_KEY = 'b08af64dcf9354f4c07f28e924843e4c';
>>>>>>> ceb0f79ea11fc3c88dc7a7b0732f0ed74994e2bf

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


        // Forecast Time

        const forecastTime =
            document.createElement('div');

        forecastTime.className =
            'forecast-time';


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
            forecastTime
        );


        // Weather Icon

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


        // Description

        const forecastDesc =
            document.createElement('div');

        forecastDesc.className =
            'forecast-desc';

        forecastDesc.textContent =
            weatherInfo.weather[0].description;


        forecastCard.append(
            forecastDesc
        );


        // Temperature

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