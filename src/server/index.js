const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('client'));

async function scrapeTextFromURL(url) {
    try {
        console.log(`Fetching and scraping text from URL: ${url}`);
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const text = $('body').text().trim();

        if (!text) {
            console.error('No text content found at the provided URL');
            return null;
        }

        const trimmedText = text.slice(0, 200);
        console.log(`Extracted Text (200 characters):\n${trimmedText}\n--- End of Text Preview ---`);
        return trimmedText;
    } catch (error) {
        console.error('Error while scraping text from the URL:', error.message);
        throw new Error('Failed to scrape text from the URL');
    }
}

app.post('/analyze-url', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        console.error('No URL provided in the request body');
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        new URL(url);
    } catch (error) {
        console.error('Invalid URL format:', url);
        return res.status(400).json({ error: 'Invalid URL format' });
    }

    try {
        const text = await scrapeTextFromURL(url);

        if (!text) {
            return res.status(400).json({ error: 'No text content found at the provided URL' });
        }

        const response = await axios.post('https://kooye7u703.execute-api.us-east-1.amazonaws.com/NLPAnalyzer', { text });

        return res.json(response.data);
    } catch (error) {
        console.error('Error during URL processing or API request:', error.message);
        return res.status(500).json({ error: 'Failed to analyze the URL' });
    }
});

app.get('/', (req, res) => {
    res.send("This is the server API page. You may access its services via the client app.");
});

app.listen(8000, () => {
    console.log('Server running on port 8000');
});