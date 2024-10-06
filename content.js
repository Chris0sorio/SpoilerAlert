chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'displayMovies') {
    const movies = request.movies;
    console.log('Movies received in content script:', movies); // Debugging log

    // Collect unique titles, actors, characters, and directors
    const titles = new Set();
    const actors = new Set();
    const characters = new Set();
    const directors = new Set();

    movies.forEach(movie => {
      titles.add(movie.title);
      movie.actors.forEach(actor => actors.add(actor));
      movie.characters.forEach(character => characters.add(character));
      movie.directors.forEach(director => directors.add(director));
    });

    // Log unique titles, actors, characters, and directors to the browser's console
    console.log('Titles:', Array.from(titles).join(', '));
    console.log('Actors:', Array.from(actors).join(', '));
    console.log('Characters:', Array.from(characters).join(', '));
    console.log('Directors:', Array.from(directors).join(', '));

    function censorParagraphs() {
      // Create a regex pattern to match any of the movie titles, actors, directors, or characters
      const combinedPattern = [
        ...titles,
        ...actors,
        ...directors,
        ...characters
      ].filter(Boolean).join('|');
      const paragraphRegex = new RegExp(`\\b(${combinedPattern})\\b`, 'i');

      // Traverse all <p> elements and censor paragraphs containing the movie title, actor, director, or character
      const paragraphs = document.querySelectorAll('p');
      paragraphs.forEach(paragraph => {
        if (paragraphRegex.test(paragraph.textContent)) {
          paragraph.textContent = '****';
        }
      });
    }

    censorParagraphs();
    sendResponse({ status: 'Censoring complete' }); // Debugging log
  }
});
