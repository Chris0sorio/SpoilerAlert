// Add an event listener for the button click
document.addEventListener('DOMContentLoaded', function () {
	document.getElementById('timeSelectionButton').addEventListener('click', timeButtonFunction);
  
	// Add event listeners for the dropdown items
	document.getElementById('OneDay').addEventListener('click', function() { selectMode('One Day'); });
	document.getElementById('OneWeek').addEventListener('click', function() { selectMode('One Week'); });
	document.getElementById('OneMonth').addEventListener('click', function() { selectMode('One Month'); });
  });
  
  function timeButtonFunction() {
	document.getElementById("myDropdown").classList.toggle("show");
  }
  
  function selectMode(mode) {
	document.getElementById('DateCurrentlyOn').textContent = `Selected Mode: ${mode}`;
	document.getElementById("myDropdown").classList.remove("show");
  }