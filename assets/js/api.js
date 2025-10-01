/**
 * Fetches photos for a given destination from the Unsplash API.
 * @param {string} destination - The name of the destination to search for.
 * @returns {Promise<object[]>} A promise that resolves to an array of photo objects.
 */
async function getPhotosForDestination(destination) {
    const apiUrl = `https://api.unsplash.com/search/photos?query=${destination}&per_page=10&orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY}`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Unsplash API error: ${response.status}`);
        }
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error("Failed to fetch photos from Unsplash:", error);
        return []; // Return empty array on error
    }
}

/**
 * Fetches the current weather for a given destination from the OpenWeatherMap API.
 * @param {string} destination - The name of the destination (city).
 * @returns {Promise<object|null>} A promise that resolves to a weather data object, or null on error.
 */
async function getWeatherForDestination(destination) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${destination}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`OpenWeatherMap API error: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch weather from OpenWeatherMap:", error);
        return null; // Return null on error
    }
}

/**
 * Fetches the 5-day weather forecast for a given destination from the OpenWeatherMap API.
 * @param {string} destination - The name of the destination (city).
 * @returns {Promise<object|null>} A promise that resolves to a forecast data object, or null on error.
 */
async function getForecastForDestination(destination) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${destination}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`OpenWeatherMap Forecast API error: ${response.status}`);
        }
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
        if (!response.ok) {
            throw new Error(`Wikipedia API error: ${response.status}`);
        }
        const data = await response.json();

        // The data structure is nested, so we need to navigate it to find the extract
        const pages = data.query.pages;
        const pageId = Object.keys(pages)[0]; // Get the first (and usually only) page ID

        // If the page ID is -1, it means the article was not found
        if (pageId === "-1") {
            return `Explore the stunning landscapes and vibrant culture of this beautiful destination.`;
        }

        const extract = pages[pageId].extract;

        // Return the extract if it exists, otherwise a fallback
        return extract || `No summary available for this destination. Explore its stunning landscapes and culture.`;

    } catch (error) {
        console.error("Failed to fetch from Wikipedia API:", error);
        // Provide a generic fallback description if the API call fails
        return `Explore the stunning landscapes and vibrant culture of this beautiful destination.`;
    }
}