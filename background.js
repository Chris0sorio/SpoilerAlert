console.log('Extension installed');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fetchMovies') {
    const startDate = request.startDate;
    console.log(`Fetching movies for start date: ${startDate}`);

    // Fetch movies from your backend
    fetch(`http://localhost:3000/search-movies?startDate=${startDate}`)
      .then(response => response.json())
      .then(data => {
        console.log('Data fetched from backend:', data);
        sendResponse({ movies: data });
      })
      .catch(error => {
        console.error('Error fetching movies:', error);
        sendResponse({ error: 'Failed to fetch movies' });
      });

    return true; // Keep the message channel open for sendResponse
  }
});

// Listen for tab updates to check if the active tab is valid for content script communication
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && !tab.url.startsWith('chrome://')) {
    chrome.tabs.sendMessage(tabId, { action: 'censorTerms', movies: {} }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Error sending message to content script:', chrome.runtime.lastError);
      } else {
        console.log('Response from content script:', response);
      }
    });
  }
});
