const apiKey = "ce6d1760df5c5526c7011be58d0f916f"; // OpenWeatherMap API key
const searchBtn = document.getElementById("search-btn");
const geoBtn = document.getElementById("geo-btn");
const cityInput = document.getElementById("city");
const cityName = document.getElementById("city-name");
const description = document.getElementById("description");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");
const weatherInfo = document.querySelector(".weather-info");
const errorMessage = document.getElementById("error-message");
const weatherIcon = document.getElementById("weather-icon");
const feelsLike = document.getElementById("feels-like");
const pressure = document.getElementById("pressure");
const clouds = document.getElementById("clouds");
const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");

// Event listener for search button
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city === "") {
    alert("Enter some City name!");
  }
  if (city) {
    fetchWeather(city);
  } else {
    errorMessage.textContent = "Please enter a valid city name.";
  }
});

// Event listener for "Use My Location" button
geoBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCoordinates(latitude, longitude);
      },
      (error) => {
        errorMessage.textContent = "Unable to retrieve location.";
      }
    );
  } else {
    errorMessage.textContent = "Geolocation is not supported by your browser.";
  }
});

// Fetch weather by city name
async function fetchWeather(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    );

    if (!response.ok) {
      throw new Error("City not found! , Enter Valid city name!");
    }

    const data = await response.json();
    updateUI(data);
  } catch (error) {
    weatherInfo.style.display = "none";
    errorMessage.textContent = error.message;
  }
}

// Fetch weather by coordinates
async function fetchWeatherByCoordinates(latitude, longitude) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
    );

    if (!response.ok) {
      throw new Error("Unable to fetch weather for your location");
    }

    const data = await response.json();
    updateUI(data);
  } catch (error) {
    weatherInfo.style.display = "none";
    errorMessage.textContent = error.message;
  }
}

// Update UI with weather data
function updateUI(data) {
  errorMessage.textContent = "";
  weatherInfo.style.display = "block";
  cityName.textContent = data.name;
  description.textContent = data.weather[0].description;
  weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  temperature.textContent = data.main.temp;
  feelsLike.textContent = data.main.feels_like;
  humidity.textContent = data.main.humidity;
  pressure.textContent = data.main.pressure;
  windSpeed.textContent = data.wind.speed;
  clouds.textContent = data.clouds.all;

  const sunriseTime = new Date(data.sys.sunrise * 1000);
  const sunsetTime = new Date(data.sys.sunset * 1000);
  sunrise.textContent = sunriseTime.toLocaleTimeString();
  sunset.textContent = sunsetTime.toLocaleTimeString();

  document.body.style.background = getBackground(data.weather[0].main);
}

// Change background dynamically based on weather
function getBackground(weather) {
  switch (weather.toLowerCase()) {
    case "clear":
      return "linear-gradient(to bottom, #FFD700, #f5f5f5)";
    case "clouds":
      return "linear-gradient(to bottom, #D3D3D3, #f5f5f5)";
    case "rain":
      return "linear-gradient(to bottom, #87CEEB, #f5f5f5)";
    case "snow":
      return "linear-gradient(to bottom, #FFFFFF, #f5f5f5)";
    default:
      return "linear-gradient(to bottom, #87CEFA, #f5f5f5)";
  }
}
