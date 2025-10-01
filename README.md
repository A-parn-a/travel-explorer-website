Travel Explorer Website
Live Site: https://a-parn-a.github.io/travel-explorer-website/

A responsive and dynamic travel destination exploration website built with vanilla HTML, CSS, and JavaScript. This project provides a clean, modern interface for users to discover popular destinations, view stunning photography, and check real-time weather information, simplifying the trip planning process.

Features
Dynamic Hero Carousel: A beautiful, auto-playing carousel on the homepage with full-width background images.

API-Driven Content: Dynamically fetches and displays destination photos, descriptions, and weather data from third-party APIs.

Popular Destinations: A curated grid of popular travel spots on the homepage to inspire users.

Destination Search: Users can search for any destination to view a detailed page.

Detailed Destination Pages: Each destination has a dedicated page featuring:

A stunning hero header image.

An encyclopedic description from the Wikipedia API.

An interactive photo gallery with clickable thumbnails.

A real-time "Current Weather" widget.

Live Weather Dashboard: A separate page where users can look up the current weather and a 5-day forecast for any city.

Fully Responsive Design: A mobile-first design that ensures a seamless experience on all devices, from phones to desktops.

Animated Mobile Navigation: A clean hamburger menu with a smooth animation that toggles a full-screen navigation menu.

Icon-driven Mobile Search: A space-saving search icon on mobile that reveals a search bar with a smooth dropdown animation.

Technologies Used
Frontend:

HTML5

CSS3 (with CSS Variables, Grid, Flexbox)

JavaScript (ES6+)

APIs:

Unsplash API for high-quality destination photography.

OpenWeatherMap API for live weather data and forecasts.

Wikipedia API for destination descriptions.

Deployment:

Git & GitHub for version control.

GitHub Pages for hosting.

GitHub Actions for Continuous Deployment (CI/CD).

Screenshots
Homepage

Destination Page

Weather Dashboard

Local Setup
To run this project on your local machine:

Clone the repository:

git clone [https://github.com/A-parn-a/travel-explorer-website.git](https://github.com/A-parn-a/travel-explorer-website.git)

Navigate to the project directory:

cd travel-explorer-website

Create your own secrets file:
The project uses a secrets.js file (ignored by Git) to store API keys. Create a new file at assets/js/secrets.js and add your own API keys in the following format:

const UNSPLASH_API_KEY = "your_unsplash_api_key_here";
const OPENWEATHER_API_KEY = "your_openweathermap_api_key_here";

Open index.html:
Open the index.html file in your browser to view the project.

License
This project is licensed under the MIT License. See the LICENSE file for details.