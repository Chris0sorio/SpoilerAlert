document.getElementById('fetch-movies').addEventListener('click', () => {
    const startDate = document.getElementById('start-date').value;
    console.log('Start Date:', startDate); // Debugging log
  
    if (startDate) {
      chrome.runtime.sendMessage({ action: 'fetchMovies', startDate }, response => {
        console.log('Response from background:', response); // Debugging log
        document.getElementById('status').textContent = 'Movies fetched and paragraphs censored!';
      });
    } else {
      document.getElementById('status').textContent = 'Please select a start date.';
    }
  });
  