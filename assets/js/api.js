/**
 * Fetches photos for a given destination from the Unsplash API.
 * @param {string} destination - The name of the destination.
 * @returns {Promise<object[]|null>} A promise that resolves to an array of photos, or null on error.
 */
async function getPhotosForDestination(destination) {
    // This now uses the correct variable name: UNSPLASH_API_KEY
    const apiUrl = `https://api.unsplash.com/search/photos?page=1&query=${destination}&client_id=${UNSPLASH_API_KEY}&per_page=12`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) { throw new Error(`Unsplash API error: ${response.status}`); }
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error("Failed to fetch from Unsplash:", error);
        return null;
    }
}

/**
 * Fetches the current weather for a given destination from the OpenWeatherMap API.
 * @param {string} destination - The name of the destination (city).
 * @returns {Promise<object|null>} A promise that resolves to a weather data object, or null on error.
 */
async function getWeatherForDestination(destination) {
    // This now uses the correct variable name: OPENWEATHER_API_KEY
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${destination}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    try {
        const response = await fetch(apiUrl);
        if (response.status === 404) {
            console.error(`OpenWeatherMap API error: City "${destination}" not found.`);
            return null;
        }
        if (!response.ok) { throw new Error(`OpenWeatherMap API error: ${response.status}`); }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch current weather from OpenWeatherMap:", error);
        return null;
    }
}

/**
 * Fetches the 5-day weather forecast for a given destination from the OpenWeatherMap API.
 * @param {string} destination - The name of the destination (city).
 * @returns {Promise<object|null>} A promise that resolves to a forecast data object, or null on error.
 */
async function getForecastForDestination(destination) {
    // This now uses the correct variable name: OPENWEATHER_API_KEY
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${destination}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    try {
        const response = await fetch(apiUrl);
        if (response.status === 404) { return null; }
        if (!response.ok) { throw new Error(`OpenWeatherMap Forecast API error: ${response.status}`); }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch forecast from OpenWeatherMap:", error);
        return null;
    }
}

/**
 * Fetches a summary for a destination from the Wikipedia API.
 * @param {string} destination - The name of the destination to look up.
 * @returns {Promise<string>} A promise that resolves to the Wikipedia summary, or a default text on error.
 */
async function getWikipediaInfo(destination) {
    const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=true&explaintext=true&redirects=1&titles=${encodeURIComponent(destination)}&origin=*`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) { throw new Error(`Wikipedia API error: ${response.status}`); }
        const data = await response.json();
        const pages = data.query.pages;
        const pageId = Object.keys(pages)[0];
        if (pageId === "-1") { return `Explore the stunning landscapes and vibrant culture of this beautiful destination.`; }
        const extract = pages[pageId].extract;
        return extract || `No summary available. Explore its stunning landscapes and culture.`;
    } catch (error) {
        console.error("Failed to fetch from Wikipedia API:", error);
        return `Explore the stunning landscapes and vibrant culture of this beautiful destination.`;
    }
}

