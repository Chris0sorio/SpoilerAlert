chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fetchMovies') {
    const { startDate } = request;
    console.log('Fetching movies for start date:', startDate); // Debugging log

    fetch(`http://localhost:3000/search-movies?startDate=${startDate}`)
      .then(response => response.json())
      .then(data => {
        console.log('Data fetched from backend:', data); // Debugging log

        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
          if (tabs.length > 0) {
            chrome.tabs.sendMessage(tabs.id, { action: 'displayMovies', movies: data }, response => {
              console.log('Message sent to content script:', response); // Debugging log
            });
          } else {
            console.error('No active tab found');
          }
        });
        sendResponse({ movies: data });
      })
      .catch(error => {
        console.error('Error fetching movies:', error);
        sendResponse({ error: 'Error fetching movies' });
      });
    return true; // Will respond asynchronously.
  }
});
