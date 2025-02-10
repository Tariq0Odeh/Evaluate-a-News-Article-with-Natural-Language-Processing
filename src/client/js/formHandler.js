export function setupFormListener() {
    const form = document.getElementById("url-form"); 
    const resultDiv = document.getElementById("result");
    const sentimentEl = document.getElementById("sentiment");
    const analysisDataEl = document.getElementById("analysis-data");

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const url = document.getElementById("url").value;

        // Validate the URL
        try {
            new URL(url); // This will throw an error if the URL is invalid
        } catch (error) {
            alert("Please enter a valid URL!");
            return;
        }

        // Clear previous results and hide the result div
        sentimentEl.innerText = "";
        analysisDataEl.innerText = "";
        resultDiv.style.display = "none";

        // Send the URL to the server for analysis
        fetch("http://localhost:8000/analyze-url", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ url }),
        })
        .then(response => {
            if (!response.ok) {
                // Handle server errors (e.g., 400, 500)
                return response.json().then(errorData => {
                    throw new Error(errorData.error || "Failed to analyze the URL");
                });
            }
            return response.json();
        })
        .then(data => {
            // Display the results
            resultDiv.style.display = "block";
            sentimentEl.innerText = `Sentiment: ${data.sentiment}`;
            analysisDataEl.innerText = JSON.stringify(data.sentiment_scores, null, 2);
        })
        .catch(error => {
            console.error("Error:", error);
            resultDiv.style.display = "block";
            sentimentEl.innerText = `Error: ${error.message}`;
            analysisDataEl.innerText = "";
        });
    });
}