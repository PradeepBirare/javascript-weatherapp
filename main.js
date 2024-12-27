const cityName = document.querySelector('.city-name');
const currentTempIcon = document.querySelector('.current-temp-icon');
const currentTemp = document.querySelector('.current-temp');
const currentTempDesc = document.querySelector('.current-temp-desc');
const maxTemp = document.querySelector('.max-temp');
const minTemp = document.querySelector('.min-temp');
const forecastContainer = document.querySelector('.forecast-container');
const loading = document.querySelector('#loading');
const weatherContainer = document.querySelector('#weather-container');

const OPENWEATHERMAP_API_KEY = 'b08af64dcf9354f4c07f28e924843e4c';

function parseWeatherData(data) {
    // console.log(data);
    cityName.textContent = data.name;
    currentTempIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    currentTempDesc.textContent = data.weather[0].description;
    currentTemp.innerHTML = `${data.main.temp}&deg;C`;
    maxTemp.innerHTML = `H: ${data.main.temp_max}&deg;C`;
    minTemp.innerHTML = `L: ${data.main.temp_min}&deg;C`;
}

function getCurrentWeatherApi(city, lat, lon) {
    loading.style.display = 'block';
    weatherContainer.style.display = 'none';
    let url;
    if (city) {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`;
    } else {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`;
    }
    fetch(url)
        .then(res => res.json())
        .then(data => parseWeatherData(data))
        .catch(error => console.error(error))
        .finally(() => {
            loading.style.display = 'none';
            weatherContainer.style.display = 'block';
        });
}

function parseForecastData(data) {
    console.log(data);
    data.list.forEach(weatherInfo => {
        const forecastCard = document.createElement('div');
        forecastCard.className = 'forecast-card';
    
        const forecastTime = document.createElement('div');
        forecastTime.className = 'forecast-time';
        const dt = new Date(weatherInfo.dt_txt);
        forecastTime.textContent = dt.getHours().toString().padStart(2, 0) + ':' + dt.getMinutes().toString().padStart(2, 0);
        forecastCard.append(forecastTime);

        const forecastIcon = document.createElement('img');
        forecastIcon.className = 'forecast-icon';
        forecastIcon.src = `https://openweathermap.org/img/wn/${weatherInfo.weather[0].icon}@2x.png`;
        forecastCard.append(forecastIcon);
    
        const forecastDesc = document.createElement('div');
        forecastDesc.className = 'forecast-desc';
        forecastDesc.textContent = weatherInfo.weather[0].description;
        forecastCard.append(forecastDesc);
    
        const forecastTemp = document.createElement('div');
        forecastTemp.className = 'forecast-temp';
        forecastTemp.innerHTML = `${weatherInfo.main.temp}&deg;C`;
        forecastCard.append(forecastTemp);

        forecastContainer.append(forecastCard);
    });
}

function getForecastWeatherApi(city, lat, lon) {
    let url;
    if (city) {
        url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${OPENWEATHERMAP_API_KEY}&units=metric&cnt=4`;
    } else {
        url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHERMAP_API_KEY}&units=metric&cnt=4`;
    }
    fetch(url)
        .then(res => res.json())
        .then(data => parseForecastData(data))
        .catch(error => console.error(error));
}

const params = (new URL(document.location)).searchParams;
const city = params.get('city');

navigator.geolocation.getCurrentPosition((position) => {
    console.log(position);
    getCurrentWeatherApi(null, position.coords.latitude, position.coords.longitude);
    getForecastWeatherApi(null, position.coords.latitude, position.coords.longitude);
}, error => {
    console.error(error);
    getCurrentWeatherApi(city || 'mumbai');
    getForecastWeatherApi(city || 'mumbai');
})

// getCurrentWeatherApi(city || 'mumbai');
// getForecastWeatherApi(city || 'mumbai');