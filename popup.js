document.getElementById('fetch-movies').addEventListener('click', () => {
  const startDate = document.getElementById('start-date').value;
  console.log('Start Date:', startDate);

  if (startDate) {
    chrome.runtime.sendMessage({ action: 'fetchMovies', startDate }, response => {
      if (response.error) {
        console.error('Error:', response.error);
        document.getElementById('status').textContent = 'Error fetching movies.';
      } else {
        console.log('Response from background:', response);
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'censorTerms', movies: response.movies });
        });
        document.getElementById('status').textContent = 'Movies fetched and terms censored!';
      }
    });
  } else {
    document.getElementById('status').textContent = 'Please select a start date.';
  }
});
