async function fetchAsteroids() {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;

    if (!startDate || !endDate) {
        alert('Please enter both start and end dates.');
        return;
    }

    try {
        const response = await fetch('http://localhost:8000/fetch-asteroids', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ startDate, endDate }),
        });

        const data = await response.json();

        if (data.near_earth_objects) {
            displayAsteroids(data.near_earth_objects);
        } else {
            alert('No asteroid data found for the selected dates.');
        }
    } catch (error) {
        console.error('Error fetching asteroid data:', error);
        alert('An error occurred while fetching asteroid data.');
    }
}

function displayAsteroids(asteroids) {
    const asteroidDataContainer = document.getElementById('asteroid-data');
    asteroidDataContainer.innerHTML = ''; // Clear previous results

    const asteroidList = document.createElement('ul');

    for (const date in asteroids) {
        asteroids[date].forEach(asteroid => {
            const listItem = document.createElement('li');
            const name = asteroid.name;
            const diameter = asteroid.estimated_diameter.kilometers.estimated_diameter_max.toFixed(2);
            const velocity = asteroid.close_approach_data[0].relative_velocity.kilometers_per_hour;

            listItem.textContent = `${name} (Diameter: ${diameter} km, Velocity: ${velocity} km/h)`;
            asteroidList.appendChild(listItem);
        });
    }

    asteroidDataContainer.appendChild(asteroidList);
}