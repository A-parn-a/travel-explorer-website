document.addEventListener('DOMContentLoaded', () => {
    // Check which page is currently loaded and run the appropriate logic
    if (document.getElementById('destinations-grid')) {
        initHomePage();
    } else if (document.getElementById('destination-content')) {
        initDestinationPage();
    } else if (document.getElementById('weather-results')) { 
        initWeatherPage(); 
    }
    
    initMobileMenu();
    initMobileSearch();
});

// This object store custom destination info
const destinationInfo = {
    'Paris': {
        description: 'The capital of France, known for its art, fashion, gastronomy, and culture.'
    },
    'Kyoto': {
        description: 'Once the imperial capital of Japan, famous for its classical Buddhist temples and gardens.'
    },
    'Rome': {
        description: 'The eternal city, showcasing millennia of art, architecture, and history.'
    },
    'Bora Bora': {
        description: 'A stunning South Pacific island known for its scuba diving and luxury overwater bungalows.'
    },
    'New York': {
        description: 'The city that never sleeps, home to iconic landmarks, Broadway shows, and endless energy.'
    },
    'Cairo': {
        description: 'Egypt’s sprawling capital, set on the Nile River, with nearby Giza pyramid complex.'
    }
};

/**
 * Initializes functionality for the Home Page (index.html).
 */
function initHomePage() {
    initHeroCarousel();
    loadPopularDestinations();
    
    const searchBar = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');

    searchButton.addEventListener('click', handleSearch);
    searchBar.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    // Event delegation for clicking on destination cards
    const destinationsGrid = document.getElementById('destinations-grid');
    destinationsGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.destination-card');
        if (card) {
            const destinationName = card.dataset.destination;
            window.location.href = `destination.html?q=${encodeURIComponent(destinationName)}`;
        }
    });
}

/**
 * Initializes functionality for the Destination Detail Page (destination.html).
 */
async function initDestinationPage() {
    const params = new URLSearchParams(window.location.search);
    const destinationQuery = params.get('q');

    if (!destinationQuery) {
        // Handle case where no destination is provided
        document.getElementById('destination-title').textContent = 'No Destination Specified';
        document.getElementById('destination-description').textContent = 'Please go back to the homepage and select a destination to explore.';
        return;
    }

        // Now fetching from all three APIs at the same time!
    const [photos, weather, wikiInfo] = await Promise.all([
        getPhotosForDestination(destinationQuery),
        getWeatherForDestination(destinationQuery),
        getWikipediaInfo(destinationQuery) 
    ]);

    // Pass the APIs to the display function
    displayDestinationDetails(destinationQuery, photos, weather, wikiInfo);
}

/**
 * Initializes functionality for the Weather Dashboard page (weather.html).
 */
function initWeatherPage() {
    const cityInput = document.getElementById('city-input');
    const getWeatherBtn = document.getElementById('get-weather-btn');

    getWeatherBtn.addEventListener('click', fetchAndDisplayWeather);
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            fetchAndDisplayWeather();
        }
    });

    async function fetchAndDisplayWeather() {
        const city = cityInput.value.trim();
        if (!city) {
            alert('Please enter a city name.');
            return;
        }

        const resultsContainer = document.getElementById('weather-results');
        resultsContainer.innerHTML = '<p>Loading weather data...</p>';

        const [currentWeather, forecastData] = await Promise.all([
            getWeatherForDestination(city),
            getForecastForDestination(city)
        ]);
        
        displayWeatherDashboard(currentWeather, forecastData);
    }
}

/**
 * Loads a predefined list of popular destinations onto the homepage.
 */
async function loadPopularDestinations() {
    const popular = ['Paris', 'Kyoto', 'Rome', 'Bora Bora', 'New York', 'Cairo'];
    const grid = document.getElementById('destinations-grid');
    grid.innerHTML = ''; // Clear placeholder cards

    for (const dest of popular) {
        const photos = await getPhotosForDestination(dest);
        if (photos.length > 0) {
            // Get custom description from the destinationInfo object
            const description = destinationInfo[dest]?.description || photos[0].alt_description;
            
            // Pass the description when creating the card
            createDestinationCard(dest, photos[0].urls.small, description);
        }
    }
}

/**
 * Handles the search functionality.
 */
function handleSearch() {
    const searchInput = document.querySelector('.search-bar input');
    const query = searchInput.value.trim();
    if (query) {
        // Redirect to the destination page with the search query
        window.location.href = `destination.html?q=${encodeURIComponent(query)}`;
    }
}

/**
 * Initializes the hamburger menu for mobile navigation.
 */
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger-menu');
    const nav = document.querySelector('.navigation');
    
    if (hamburger && nav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            nav.classList.toggle('active');
        });
    }
}

/**
 * Initializes the carousel functionality for the hero section.
 */
function initHeroCarousel() {
    const slides = document.querySelectorAll('.hero-slide');
    const prevBtn = document.getElementById('hero-prev');
    const nextBtn = document.getElementById('hero-next');
    let currentSlide = 0;
    let slideInterval;

    if (slides.length <= 1) return; // Don't run carousel if there's only one slide

    function showSlide(index) {
        // Remove active class from the current slide
        slides[currentSlide].classList.remove('active');
        
        // Update currentSlide index
        currentSlide = (index + slides.length) % slides.length;
        
        // Add active class to the new slide
        slides[currentSlide].classList.add('active');
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }
    
    // Auto-play functionality
    function startCarousel() {
       slideInterval = setInterval(nextSlide, 7000); // Change slide every 7 seconds
    }

    function stopCarousel() {
        clearInterval(slideInterval);
    }
    
    // Event listeners for arrow buttons
    nextBtn.addEventListener('click', () => {
        stopCarousel();
        nextSlide();
        startCarousel();
    });

    prevBtn.addEventListener('click', () => {
        stopCarousel();
        prevSlide();
        startCarousel();
    });

    // Start the carousel on page load
    startCarousel();
}
// In assets/js/app.js
/**
 * Initializes the pop-up search bar for mobile devices.
 */
function initMobileSearch() {
    const searchIcon = document.querySelector('.mobile-search-icon');
    const searchForm = document.getElementById('mobile-search-form');
    const searchInput = document.getElementById('mobile-search-input');

    if (searchIcon && searchForm && searchInput) {
        // Show/hide the search bar when the icon is clicked
        searchIcon.addEventListener('click', () => {
            searchForm.classList.toggle('active');
        });

        // Handle the search when the form is submitted
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent page reload
            const query = searchInput.value.trim();
            if (query) {
                // Redirect to destination page with the search query
                window.location.href = `destination.html?q=${encodeURIComponent(query)}`;
            }
        });
    }
}