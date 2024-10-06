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

  document.addEventListener('DOMContentLoaded', function() {
    const startDateInput = document.getElementById('start-date');
  
    const savedDate = localStorage.getItem('savedStartDate');
    if (savedDate) {
      startDateInput.value = savedDate;
    }
  
    startDateInput.addEventListener('change', function() {
      const newDate = this.value;
      const savedDate = localStorage.getItem('savedStartDate');
  
      if (!savedDate || new Date(newDate) > new Date(savedDate)) {
        localStorage.setItem('savedStartDate', newDate);
      }
    });
  });