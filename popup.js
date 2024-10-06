document.getElementById('fetch-movies').addEventListener('click', () => {
  const startDate = document.getElementById('start-date').value;
  console.log('Start Date:', startDate);

  if (startDate) {
    chrome.runtime.sendMessage({ action: 'fetchMovies', startDate }, response => {
      console.log('Response from background:', response);
      document.getElementById('status').textContent = 'Movies fetched and terms censored!';
    });
  } else {
    document.getElementById('status').textContent = 'Please select a start date.';
  }
});
