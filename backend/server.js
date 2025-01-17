const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const fetch = require('node-fetch');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const port = process.env.PORT || 3500;
const NASA_API_KEY = process.env.NASA_API_KEY;
GROQ_API_KEY = process.env.GROQ_API_KEY;

// Middleware to parse JSON
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '..', 'frontend')));
app.use('/images', express.static(path.join(__dirname, '..', 'images')));

// Chatbot route
app.post('/chatbot', async (req, res) => {
    try {
        const user_input = req.body.message;
        console.log('User input received:', user_input);
        if (!user_input) {
            return res.status(400).json({ error: 'User input is required.' });
        }

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [{ role: 'user', content: user_input }],
            }),
        });

        if (!response.ok) {
            const errorDetails = await response.text();
            console.error('Groq API Error:', errorDetails);
            throw new Error(`Groq API returned an error: ${errorDetails}`);
        }

        const data = await response.json();
        res.status(200).json({ response: data.choices[0].message.content });
    } catch (error) {
        console.error('Server Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Asteroid data route
app.post('/fetch-asteroids', async (req, res) => {
    try {
        const { startDate, endDate } = req.body;

        if (!startDate || !endDate) {
            return res.status(400).json({ error: 'Start and end dates are required.' });
        }

        const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${NASA_API_KEY}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.near_earth_objects) {
            res.status(200).json({ near_earth_objects: data.near_earth_objects });
        } else {
            res.status(404).json({ error: 'No asteroid data found for the selected dates.' });
        }
    } catch (error) {
        console.error('Server Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Function to display asteroid data on frontend
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

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
