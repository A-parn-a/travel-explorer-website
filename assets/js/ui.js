/**
 * Creates and appends a destination card to the grid.
 * @param {string} name - The destination name.
 * @param {string} imageUrl - The URL for the card's background image.
 * @param {string} description - A short description of the destination.
 */
function createDestinationCard(name, imageUrl, description) {
    const grid = document.getElementById('destinations-grid');
    if (!grid) return;

    const card = document.createElement('div');
    card.className = 'destination-card';
    card.dataset.destination = name; // Store destination name in data attribute

    card.innerHTML = `
        <img src="${imageUrl}" alt="Image of ${name}" onerror="this.src='https://placehold.co/400x300/cccccc/FFFFFF?text=Image+Not+Found'">
        <div class="card-content">
            <h3>${name}</h3>
            <p>${description || 'A beautiful destination waiting to be explored.'}</p>
        </div>
    `;
    
    // Add an animation class for the fade-in effect
    card.classList.add('fade-in');

    grid.appendChild(card);
}

/**
 * Displays the full details for a destination page using data from all APIs.
 * @param {string} destinationName - The name of the destination.
 * @param {object[]} photoData - Array of photo objects from Unsplash.
 * @param {object} weatherData - Weather data object from OpenWeatherMap.
 * @param {string} wikiSummary - The text summary from Wikipedia.
 */
function displayDestinationDetails(destinationName, photoData, weatherData, wikiSummary) {
    const titleEl = document.getElementById('destination-title');
    const countryEl = document.getElementById('destination-country');
    const descriptionEl = document.getElementById('destination-description');
    
    const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

    if (photoData.length === 0) {
        titleEl.textContent = `${capitalize(destinationName)} Not Found`;
        descriptionEl.textContent = `We couldn't find any photos for "${destinationName}". Please check the spelling or try another search.`;
        countryEl.textContent = '';
        return;
    }

    const mainPhoto = photoData[0];
    const locationParts = mainPhoto.user.location ? mainPhoto.user.location.split(',') : [];
    const country = locationParts.length > 1 ? locationParts[locationParts.length - 1].trim() : '';
    
    document.title = `${capitalize(destinationName)} | Travel Explorer`;
    
    titleEl.textContent = capitalize(destinationName);
    countryEl.textContent = country;
    
    // Use the Wikipedia summary for the description!
    descriptionEl.textContent = wikiSummary;

    displayGallery(photoData);
    displayWeather(weatherData);
}

/**
 * Creates and displays the image gallery on the destination page.
 * @param {object[]} photos - An array of photo objects from Unsplash.
 */
function displayGallery(photos) {
    const gallery = document.getElementById('image-gallery');
    if (!gallery) return;

    // Use the first image as the main image
    gallery.innerHTML = `
        <img src="${photos[0].urls.regular}" alt="${photos[0].alt_description}" class="main-image fade-in">
    `;
}

/**
 * Creates and displays the weather widget.
 * @param {object} weather - The weather data object from OpenWeatherMap.
 */
function displayWeather(weather) {
    const widget = document.getElementById('weather-widget');
    if (!widget) return;
    
    if (!weather) {
        widget.innerHTML = '<h2>Current Weather</h2><p>Could not load weather data.</p>';
        return;
    }

    const iconUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;
    
    widget.innerHTML = `
        <h2>Current Weather</h2>
        <img src="${iconUrl}" alt="Weather icon" class="weather-icon">
        <div class="weather-temp">${Math.round(weather.main.temp)}°C</div>
        <div class="weather-desc">${weather.weather[0].description}</div>
        <div class="weather-details">
            <p>Feels like: ${Math.round(weather.main.feels_like)}°C</p>
            <p>Humidity: ${weather.main.humidity}%</p>
            <p>Wind: ${weather.wind.speed} m/s</p>
        </div>
    `;
}

/**
 * Displays the full weather dashboard with current weather and 5-day forecast.
 * @param {object} currentWeather - The current weather data from OpenWeatherMap.
 * @param {object} forecastData - The 5-day forecast data from OpenWeatherMap.
 */
function displayWeatherDashboard(currentWeather, forecastData) {
    const resultsContainer = document.getElementById('weather-results');
    if (!resultsContainer) return;

    if (!currentWeather || !forecastData) {
        resultsContainer.innerHTML = '<p class="error-message">Could not retrieve weather data for this location. Please try another city.</p>';
        return;
    }

    // Current Weather HTML
    const currentIconUrl = `https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`;
    const currentHtml = `
        <div class="current-weather fade-in">
            <h2>Current Weather in ${currentWeather.name}</h2>
            <div class="current-weather-content">
                <img src="${currentIconUrl}" alt="Weather icon">
                <div class="current-weather-details">
                    <p class="temp">${Math.round(currentWeather.main.temp)}°C</p>
                    <p class="desc">${currentWeather.weather[0].description}</p>
                </div>
                <div class="current-weather-extra">
                    <p>Humidity: ${currentWeather.main.humidity}%</p>
                    <p>Wind Speed: ${currentWeather.wind.speed} m/s</p>
                </div>
            </div>
        </div>
    `;

    // 5-Day Forecast HTML: Filter to get one entry per day (around noon)
    const dailyForecasts = forecastData.list.filter(item => item.dt_txt.includes("12:00:00"));

    let forecastHtml = '<div class="forecast-container fade-in"><h3>5-Day Forecast</h3><div class="forecast-grid">';
    dailyForecasts.forEach(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const iconUrl = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;
        forecastHtml += `
            <div class="forecast-card">
                <p class="forecast-day">${dayName}</p>
                <img src="${iconUrl}" alt="Forecast icon">
                <p class="forecast-temp">${Math.round(day.main.temp)}°C</p>
            </div>
        `;
    });
    forecastHtml += '</div></div>';

    resultsContainer.innerHTML = currentHtml + forecastHtml;
}