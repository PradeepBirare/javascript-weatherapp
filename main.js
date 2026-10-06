```javascript
const cityName = document.querySelector('.city-name');
const currentTempIcon = document.querySelector('.current-temp-icon');
const currentTemp = document.querySelector('.current-temp');
const currentTempDesc = document.querySelector('.current-temp-desc');
const maxTemp = document.querySelector('.max-temp');
const minTemp = document.querySelector('.min-temp');
const forecastContainer = document.querySelector('.forecast-container');
const loading = document.querySelector('#loading');
const weatherContainer = document.querySelector('#weather-container');

// Add your own API key here.
// Do NOT publish your real API key in a public GitHub repository.
const OPENWEATHERMAP_API_KEY = 'YOUR_API_KEY';


// ------------------------------------
// Current Weather
// ------------------------------------

function parseWeatherData(data) {

    cityName.textContent = data.name;

    currentTempIcon.src =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    currentTempDesc.textContent =
        data.weather[0].description;

    currentTemp.innerHTML =
        `${data.main.temp}&deg;C`;

    maxTemp.innerHTML =
        `H: ${data.main.temp_max}&deg;C`;

    minTemp.innerHTML =
        `L: ${data.main.temp_min}&deg;C`;
}


function getCurrentWeatherApi(city, lat, lon) {

    loading.style.display = 'block';
    weatherContainer.style.display = 'none';

    let url;

    if (city) {

        url =
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`;

    } else {

        url =
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`;
    }

    fetch(url)

        .then(res => res.json())

        .then(data => {

            if (data.cod !== 200) {
                throw new Error(data.message);
            }

            parseWeatherData(data);
        })

        .catch(error => {

            console.error('Weather API Error:', error);

        })

        .finally(() => {

            loading.style.display = 'none';
            weatherContainer.style.display = 'block';

        });
}


// ------------------------------------
// Format Forecast Time
// ------------------------------------

function formatForecastTime(dateString) {

    const date = new Date(dateString);

    let hours = date.getHours();
    const minutes = date.getMinutes();

    const amPm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;

    if (hours === 0) {
        hours = 12;
    }

    const formattedMinutes =
        minutes.toString().padStart(2, '0');

    return `${hours}:${formattedMinutes} ${amPm}`;
}


// ------------------------------------
// Forecast Data
// ------------------------------------

function parseForecastData(data) {

    console.log(data);

    // Clear existing forecast cards
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

        forecastTime.textContent =
            formatForecastTime(weatherInfo.dt_txt);

        forecastCard.append(forecastTime);


        // Forecast Icon
        const forecastIcon =
            document.createElement('img');

        forecastIcon.className =
            'forecast-icon';

        forecastIcon.alt =
            weatherInfo.weather[0].description;

        forecastIcon.src =
            `https://openweathermap.org/img/wn/${weatherInfo.weather[0].icon}@2x.png`;

        forecastCard.append(forecastIcon);


        // Forecast Description
        const forecastDesc =
            document.createElement('div');

        forecastDesc.className =
            'forecast-desc';

        forecastDesc.textContent =
            weatherInfo.weather[0].description;

        forecastCard.append(forecastDesc);


        // Forecast Temperature
        const forecastTemp =
            document.createElement('div');

        forecastTemp.className =
            'forecast-temp';

        forecastTemp.innerHTML =
            `${weatherInfo.main.temp}&deg;C`;

        forecastCard.append(forecastTemp);


        // Add card to forecast container
        forecastContainer.append(forecastCard);

    });
}


// ------------------------------------
// Forecast API
// ------------------------------------

function getForecastWeatherApi(city, lat, lon) {

    let url;

    if (city) {

        url =
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${OPENWEATHERMAP_API_KEY}&units=metric&cnt=4`;

    } else {

        url =
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHERMAP_API_KEY}&units=metric&cnt=4`;
    }

    fetch(url)

        .then(res => res.json())

        .then(data => {

            if (data.cod !== '200' && data.cod !== 200) {
                throw new Error(data.message);
            }

            parseForecastData(data);

        })

        .catch(error => {

            console.error('Forecast API Error:', error);

        });
}


// ------------------------------------
// Get City From URL
// ------------------------------------

const params =
    new URL(document.location).searchParams;

const city =
    params.get('city');


// ------------------------------------
// Browser Geolocation
// ------------------------------------

navigator.geolocation.getCurrentPosition(

    (position) => {

        console.log(position);

        getCurrentWeatherApi(
            null,
            position.coords.latitude,
            position.coords.longitude
        );

        getForecastWeatherApi(
            null,
            position.coords.latitude,
            position.coords.longitude
        );

    },

    (error) => {

        console.error(
            'Location Error:',
            error
        );

        getCurrentWeatherApi(
            city || 'mumbai'
        );

        getForecastWeatherApi(
            city || 'mumbai'
        );

    }
);
```
