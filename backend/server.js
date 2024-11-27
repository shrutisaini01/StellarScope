const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
// const { OpenAI } = require('openai');

dotenv.config();

const app = express();
const port = process.env.PORT||3500;

// OpenAI configuration
// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
// });

// Middleware to parse JSON
app.use(bodyParser.json());

// Serve static files from the frontend and images directories
app.use(express.static(path.join(__dirname, '..', 'frontend')));
app.use('/images', express.static(path.join(__dirname, '..', 'images')));

// Chatbot route
app.post('/chatbot', async (req, res) => {
    try {
        const user_input = req.body.message;

        // Call OpenAI API to get response
        const response = await getOpenaiResponse(user_input);
        res.status(200).json({ response: response });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

async function getOpenaiResponse(user_query) {
    const system_prompt = `
    You are a helpful assistant and will provide all the information related to the space solar system.
    `;

    const messages = [
        { role: 'system', content: system_prompt },
        { role: 'user', content: user_query }
    ];

    const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: messages
    });

    return response.choices[0].message.content.trim();
}

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});



