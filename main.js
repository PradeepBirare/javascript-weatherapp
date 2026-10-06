
const cityName = document.querySelector('.city-name');
const currentTempIcon = document.querySelector('.current-temp-icon');
const currentTemp = document.querySelector('.current-temp');
const currentTempDesc = document.querySelector('.current-temp-desc');
const maxTemp = document.querySelector('.max-temp');
const minTemp = document.querySelector('.min-temp');
const forecastContainer = document.querySelector('.forecast-container');
const loading = document.querySelector('#loading');
const weatherContainer = document.querySelector('#weather-container');


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

    fetch(url)

        .then(response => {

            if (!response.ok) {
                throw new Error('Unable to fetch weather data.');
            }

            return response.json();

        })

        .then(data => {

            if (data.cod !== 200) {
                throw new Error(data.message);
            }

            parseWeatherData(data);

        })

        .catch(error => {

            console.error('Current Weather Error:', error);

            alert(
                'Unable to load weather information. Please try again.'
            );

        })

        .finally(() => {

            loading.style.display = 'none';
            weatherContainer.style.display = 'block';

        });
}


// ==========================================
// Forecast Data
// ==========================================

function parseForecastData(data) {

    forecastContainer.innerHTML = '';

    const timezoneOffset = data.city.timezone;

    data.list.forEach(weatherInfo => {

        // ------------------------------
        // Forecast Card
        // ------------------------------

        const forecastCard =
            document.createElement('div');

        forecastCard.className =
            'forecast-card';


        // ------------------------------
        // Forecast Time
        // ------------------------------

        const forecastTime =
            document.createElement('div');

        forecastTime.className =
            'forecast-time';

        forecastTime.textContent =
            formatForecastTime(
                weatherInfo.dt,
                timezoneOffset
            );

        forecastCard.appendChild(
            forecastTime
        );


        // ------------------------------
        // Weather Icon
        // ------------------------------

        const forecastIcon =
            document.createElement('img');

        forecastIcon.className =
            'forecast-icon';

        forecastIcon.src =
            `https://openweathermap.org/img/wn/${weatherInfo.weather[0].icon}@2x.png`;

        forecastIcon.alt =
            weatherInfo.weather[0].description;

        forecastCard.appendChild(
            forecastIcon
        );


        // ------------------------------
        // Weather Description
        // ------------------------------

        const forecastDesc =
            document.createElement('div');

        forecastDesc.className =
            'forecast-desc';

        forecastDesc.textContent =
            weatherInfo.weather[0].description;

        forecastCard.appendChild(
            forecastDesc
        );


        // ------------------------------
        // Forecast Temperature
        // ------------------------------

        const forecastTemp =
            document.createElement('div');

        forecastTemp.className =
            'forecast-temp';

        forecastTemp.textContent =
            `${Math.round(weatherInfo.main.temp)}°C`;

        forecastCard.appendChild(
            forecastTemp
        );


        // ------------------------------
        // Add Card
        // ------------------------------

        forecastContainer.appendChild(
            forecastCard
        );

    });
}


// ==========================================
// Forecast API
// ==========================================

function getForecastWeatherApi(city, lat, lon) {

    let url;

    if (city) {

        url =
            `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${OPENWEATHERMAP_API_KEY}&units=metric&cnt=4`;

    } else {

        url =
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHERMAP_API_KEY}&units=metric&cnt=4`;
    }

    fetch(url)

        .then(response => {

            if (!response.ok) {
                throw new Error('Unable to fetch forecast data.');
            }

            return response.json();

        })

        .then(data => {

            if (data.cod !== '200' && data.cod !== 200) {
                throw new Error(data.message);
            }

            parseForecastData(data);

        })

        .catch(error => {

            console.error(
                'Forecast Error:',
                error
            );

        });
}


// ==========================================
// Get City From URL
// ==========================================

const params =
    new URL(window.location.href).searchParams;

const city =
    params.get('city');


// ==========================================
// Detect User Location
// ==========================================

if (navigator.geolocation) {

    navigator.geolocation.getCurrentPosition(

        position => {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;

            console.log(
                'Latitude:',
                latitude
            );

            console.log(
                'Longitude:',
                longitude
            );


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
            );

        }

    );

} else {

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
