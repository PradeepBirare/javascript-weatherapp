# 🌤️ JavaScript Weather App

A simple weather application built using **HTML, CSS, and JavaScript** that retrieves real-time weather information using the **OpenWeatherMap API**.

The application automatically detects the user's location using the browser's **Geolocation API** and displays the current weather along with a short-term forecast.

---

## 📌 Features

- 🌍 Automatic location detection
- 📍 Displays current city
- 🌡️ Current temperature in Celsius
- ☀️ Current weather condition
- 🔼 Maximum temperature
- 🔽 Minimum temperature
- 🕒 Short-term weather forecast
- 🕐 12-hour forecast time format with AM/PM
- 🌤️ Dynamic weather icons
- ⏳ Loading animation
- 🔗 URL-based city fallback
- 📱 Clean and simple weather dashboard
- 🎨 CSS-based modern UI

---

## 🖥️ Preview

The application displays the current weather at the top and upcoming forecast information in individual cards.

```text
┌─────────────────────────────────────────────┐
│                   Mumbai                    │
│                                             │
│                 ☀️  29°C                   │
│                 Clear Sky                    │
│                                             │
│              H: 32°C   L: 29°C             │
│                                             │
│                                             │
│ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐│
│ │3:00 PM │ │6:00 PM │ │9:00 PM │ │12:00AM ││
│ │   ☀️   │ │   🌤️   │ │   ☁️   │ │   🌙   ││
│ │Clear   │ │Cloudy  │ │Cloudy  │ │Clear   ││
│ │ 28°C   │ │ 27°C   │ │ 26°C   │ │ 25°C   ││
│ └────────┘ └────────┘ └────────┘ └────────┘│
└─────────────────────────────────────────────┘
```

---

## 🛠️ Technologies Used

- **HTML5** – Structure of the application
- **CSS3** – Styling and layout
- **JavaScript** – Application logic
- **OpenWeatherMap API** – Weather information
- **Fetch API** – API requests
- **Geolocation API** – User location detection
- **DOM Manipulation** – Dynamic forecast cards
- **Google Fonts** – Quicksand font
- **SVG** – Loading animation

---

## 📂 Project Structure

```text
Weather-App/
│
├── index.html
├── main.js
├── style.css
├── loading.svg
└── README.md
```

### File Description

| File | Description |
|---|---|
| `index.html` | Main structure of the weather application |
| `main.js` | Weather API integration and dynamic UI logic |
| `style.css` | Application layout and styling |
| `loading.svg` | Loading animation |
| `README.md` | Project documentation |

---

## 🔄 Application Workflow

```text
                User Opens App
                      │
                      ▼
             Request Location
                      │
             ┌────────┴────────┐
             │                 │
        Permission          Permission
          Granted             Denied
             │                 │
             ▼                 ▼
       Latitude/Longitude   URL City
             │                 │
             └────────┬────────┘
                      │
                      ▼
              Weather API
                      │
             ┌────────┴────────┐
             │                 │
             ▼                 ▼
        Current Weather     Forecast
             │                 │
             └────────┬────────┘
                      │
                      ▼
                 Display UI
```

---

## 🌍 Location Detection

The application uses the browser's Geolocation API:

```javascript
navigator.geolocation.getCurrentPosition()
```

When the user allows location access, the application retrieves:

- Latitude
- Longitude

These coordinates are then sent to OpenWeatherMap.

If the user denies location access, the application falls back to a city name.

---

## 🌡️ Current Weather

The application displays:

- City name
- Current temperature
- Weather icon
- Weather description
- Highest temperature
- Lowest temperature

Example:

```text
Mumbai

☀️ 29°C

Clear Sky

H: 32°C
L: 29°C
```

---

## 🕒 Forecast Time Formatting

Forecast timestamps received from the API are converted into a user-friendly **12-hour format**.

For example:

```text
15:00 → 3:00 PM
18:00 → 6:00 PM
21:00 → 9:00 PM
```

This is handled by the JavaScript function:

```javascript
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
```

---

## 🌤️ Dynamic Forecast Cards

Forecast cards are generated dynamically using JavaScript.

Each card contains:

- Forecast time
- Weather icon
- Weather description
- Temperature

The cards are created using DOM manipulation:

```javascript
const forecastCard = document.createElement('div');

forecastCard.className = 'forecast-card';
```

This means the forecast information does not need to be manually written into the HTML.

---

## 🔗 URL City Parameter

The application can also receive a city through the URL.

Example:

```text
index.html?city=Mumbai
```

JavaScript retrieves the city using:

```javascript
const params =
    new URL(document.location).searchParams;

const city =
    params.get('city');
```

If geolocation is unavailable, the application checks the URL city and finally falls back to Mumbai.

---

## ⏳ Loading State

While weather information is being retrieved, a loading animation is displayed.

```text
Loading
   ↓
API Request
   ↓
Weather Data
   ↓
Hide Loading
   ↓
Display Weather
```

The loading element is controlled using:

```javascript
loading.style.display = 'block';
weatherContainer.style.display = 'none';
```

After the API request:

```javascript
loading.style.display = 'none';
weatherContainer.style.display = 'block';
```

---

## 🔌 OpenWeatherMap API

The application uses two OpenWeatherMap endpoints.

### Current Weather

```text
/api/data/2.5/weather
```

### Forecast

```text
/api/data/2.5/forecast
```

The application requests temperature in Celsius using:

```text
units=metric
```

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/weather-app.git
```

### 2. Open the Project

```bash
cd weather-app
```

### 3. Configure API Key

Open:

```text
main.js
```

Add your OpenWeatherMap API key:

```javascript
const OPENWEATHERMAP_API_KEY = 'YOUR_API_KEY';
```

### 4. Run the Application

Open `index.html` in your browser.

For a better development experience, use **VS Code Live Server**.

---

## 🔐 API Key Security

**Do not upload your actual OpenWeatherMap API key to a public GitHub repository.**

For this frontend-only project, the API key is used by JavaScript in the browser. This means it can potentially be viewed by users.

For a production application, consider using:

```text
Frontend
   ↓
Backend API
   ↓
OpenWeatherMap
```

The API key can then be stored securely on the backend using environment variables.

If an API key has already been pushed to GitHub, **revoke/regenerate it before making the repository public**.

---

## 🎨 UI Design

The application uses:

- Blue gradient background
- Rounded weather container
- Rounded forecast cards
- Weather icons
- Box shadows
- Quicksand font
- Flexbox layout
- Centered weather information

---

## 📚 Concepts Demonstrated

This project demonstrates practical JavaScript concepts including:

- Variables and constants
- Functions
- Conditional statements
- Promises
- `.then()`
- `.catch()`
- `.finally()`
- Fetch API
- REST API integration
- JSON data handling
- DOM manipulation
- Dynamic element creation
- Browser Geolocation API
- URL query parameters
- Date and time formatting
- Error handling
- CSS Flexbox

---

## 🚀 Future Improvements

Possible future improvements include:

- 🔍 Add a city search box
- 🌎 Search weather for any city
- 📅 Add a complete 5-day forecast
- 🌡️ Celsius/Fahrenheit toggle
- 💨 Display wind speed
- 💧 Display humidity
- 🌅 Display sunrise and sunset
- 🧭 Display wind direction
- 🌙 Add dark mode
- 📱 Improve mobile responsiveness
- ⚠️ Add user-friendly API error messages
- 🗺️ Add an interactive weather map
- 📊 Add weather charts
- 💾 Save recently searched cities
- 🔐 Move API requests to a backend

---

## 👨‍💻 Author

**Pradeep Birare**

MCA Student | Aspiring Data Analyst | Software & Web Technologies

### Technologies

`HTML` `CSS` `JavaScript` `REST API` `Fetch API` `DOM` `Geolocation API`

---

## ⭐ Support

If you found this project useful, consider giving the repository a ⭐ on GitHub.

---

## 📄 License

This project was created for **learning and educational purposes**.
