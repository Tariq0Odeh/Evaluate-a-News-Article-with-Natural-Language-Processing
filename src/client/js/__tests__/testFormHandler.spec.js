import { setupFormListener } from '../formHandler'; // Correct import path
import fetchMock from 'jest-fetch-mock';

// Enable fetch mocking
fetchMock.enableMocks();

// Mock the DOM
beforeEach(() => {
    document.body.innerHTML = `
        <form id="url-form">
            <input id="url" type="text" />
            <button type="submit">Submit</button>
        </form>
        <div id="result" style="display: none;">
            <div id="sentiment"></div>
            <pre id="analysis-data"></pre>
        </div>
    `;

    // Initialize the form listener
    setupFormListener();
});

// Reset fetch mocking after each test
afterEach(() => {
    fetchMock.resetMocks();
});

describe('setupFormListener', () => {
    test('should prevent form submission and display error if URL is empty', () => {
        // Mock the alert function
        window.alert = jest.fn();

        // Trigger form submission
        const form = document.getElementById('url-form');
        form.dispatchEvent(new Event('submit'));

        // Check if alert was called with the correct message
        expect(window.alert).toHaveBeenCalledWith('Please enter a valid URL!');

        // Check if result div is hidden
        const resultDiv = document.getElementById('result');
        expect(resultDiv.style.display).toBe('none');
    });

    test('should fetch and display sentiment analysis results', async () => {
        // Mock the fetch response
        const mockResponse = {
            sentiment: 'positive',
            sentiment_scores: { positive: 0.9, negative: 0.1, neutral: 0.0 },
        };
        fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

        // Set a URL value
        const urlInput = document.getElementById('url');
        urlInput.value = 'https://example.com';

        // Trigger form submission
        const form = document.getElementById('url-form');
        form.dispatchEvent(new Event('submit'));

        // Wait for the fetch promise to resolve
        await new Promise((resolve) => setTimeout(resolve, 0));

        // Check if fetch was called with the correct arguments
        expect(fetchMock).toHaveBeenCalledWith('http://localhost:8000/analyze-url', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: 'https://example.com' }),
        });

        // Check if result div is displayed
        const resultDiv = document.getElementById('result');
        expect(resultDiv.style.display).toBe('block');

        // Check if sentiment and analysis data are displayed correctly
        const sentimentEl = document.getElementById('sentiment');
        const analysisDataEl = document.getElementById('analysis-data');
        expect(sentimentEl.innerText).toBe('Sentiment: positive');
        expect(analysisDataEl.innerText).toBe(JSON.stringify(mockResponse.sentiment_scores, null, 2));
    });

    test('should handle fetch errors', async () => {
        // Mock a fetch error
        fetchMock.mockRejectOnce(new Error('Network error'));

        // Set a URL value
        const urlInput = document.getElementById('url');
        urlInput.value = 'https://example.com';

        // Trigger form submission
        const form = document.getElementById('url-form');
        form.dispatchEvent(new Event('submit'));

        // Wait for the fetch promise to resolve
        await new Promise((resolve) => setTimeout(resolve, 0));

        // Check if result div is displayed
        const resultDiv = document.getElementById('result');
        expect(resultDiv.style.display).toBe('block');

        // Check if error message is displayed
        const sentimentEl = document.getElementById('sentiment');
        expect(sentimentEl.innerText).toBe('Error: Network error');
    });
});