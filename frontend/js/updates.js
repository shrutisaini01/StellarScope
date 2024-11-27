const API_KEY = 'DgdSL4j0yoi67AqLdW7Fjpn4bi3XUQjq4lEBjObv';  // Replace with your own API key if needed

// Function to convert date from "DD-MM-YYYY" to "YYYY-MM-DD"
function convertDateFormat(dateString) {
    // Expecting dateString in "DD-MM-YYYY" format
    const [day, month, year] = dateString.split('-');
    return `${year}-${month}-${day}`;  // Convert to "YYYY-MM-DD"
}

async function fetchImagery() {
    const lat = document.getElementById('latitude').value;
    const lon = document.getElementById('longitude').value;
    const dateInput = document.getElementById('date').value;
    const API_KEY = 'API_KEY';  // Replace with your actual API key

    if (!lat || !lon) {
        alert('Please enter both latitude and longitude.');
        return;
    }

    // Convert date from "DD-MM-YYYY" to "YYYY-MM-DD"
    const date = convertDateFormat(dateInput);

    const url = date ? 
        `https://api.nasa.gov/planetary/earth/imagery?lat=${lat}&lon=${lon}&date=${date}&api_key=${API_KEY}` :
        `https://api.nasa.gov/planetary/earth/imagery?lat=${lat}&lon=${lon}&api_key=${API_KEY}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }

        // Handle binary data as blob if necessary
        const data = await response.json();

        if (data.url) {
            document.getElementById('landsat-image').src = data.url;
            document.getElementById('image-date').textContent = `Date: ${data.date}`;
        } else {
            alert('No imagery found for the specified location and date.');
        }
    } catch (error) {
        console.error('Error fetching imagery:', error);
        alert(`An error occurred: ${error.message}`);
    }
}

