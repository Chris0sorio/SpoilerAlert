document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('timeSelectionButton').addEventListener('click', timeButtonFunction);
  document.getElementById('openDateChanger').addEventListener('click', toggleDateChanger);

  // Add event listeners for the dropdown items
  document.getElementById('OneDay').addEventListener('click', function() { selectMode('One Day'); });
  document.getElementById('OneWeek').addEventListener('click', function() { selectMode('One Week'); });
  document.getElementById('OneMonth').addEventListener('click', function() { selectMode('One Month'); });

  // Set default values for the date dropdowns
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth() + 1; // Months are zero-based
  const currentYear = today.getFullYear();

  // Populate day dropdown
  const dayDropdown = document.getElementById('dayDropdown');
  for (let i = currentDay; i <= 31; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    dayDropdown.appendChild(option);
  }

  // Populate month dropdown
  const monthDropdown = document.getElementById('monthDropdown');
  for (let i = currentMonth; i <= 12; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    monthDropdown.appendChild(option);
  }

  // Populate year dropdown
  const yearDropdown = document.getElementById('yearDropdown');
  for (let i = currentYear; i <= currentYear + 10; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    yearDropdown.appendChild(option);
  }

  // Set default selected values
  dayDropdown.value = currentDay;
  monthDropdown.value = currentMonth;
  yearDropdown.value = currentYear;

  // Add event listeners for the date dropdowns
  dayDropdown.addEventListener('change', updateSelectedDate);
  monthDropdown.addEventListener('change', updateSelectedDate);
  yearDropdown.addEventListener('change', updateSelectedDate);

  // Update the displayed date initially
  updateSelectedDate();
});

function timeButtonFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

function toggleDateChanger() {
  const dateChanger = document.getElementById("dateChanger");
  if (dateChanger.style.display === "none" || dateChanger.style.display === "") {
    dateChanger.style.display = "block";
  } else {
    dateChanger.style.display = "none";
  }
}

function selectMode(mode) {
  document.getElementById('DateCurrentlyOn').textContent = `Selected Mode: ${mode}`;
  document.getElementById("myDropdown").classList.remove("show");
}

function updateSelectedDate() {
  const day = document.getElementById('dayDropdown').value;
  const month = document.getElementById('monthDropdown').value;
  const year = document.getElementById('yearDropdown').value;
  document.getElementById('DateCurrentlyOn').textContent = `Selected Date: ${year}-${month}-${day}`;
}