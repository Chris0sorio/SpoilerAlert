chrome.runtime.sendMessage({ action: 'fetchMovies' }, response => {
    const movies = response.movies;

    function censorText() {
        // Create a regex pattern to match any of the movie titles, actors, directors, or characters
        const movieTitles = movies.map(movie => movie.title).join('|');
        const actors = movies.flatMap(movie => movie.actors).join('|');
        const directors = movies.flatMap(movie => movie.directors).join('|');
        const characters = movies.flatMap(movie => movie.characters).join('|');

        const combinedPattern = [movieTitles, actors, directors, characters].filter(Boolean).join('|');
        const paragraphRegex = new RegExp(`\\b(${combinedPattern})\\b`, 'i');

        // Traverse all <p> elements and censor paragraphs containing the movie title, actor, director, or character
        const paragraphs = document.querySelectorAll('p');
        paragraphs.forEach(paragraph => {
            if (paragraphRegex.test(paragraph.textContent)) {
                paragraph.textContent = '****';
            }
        });
    }

    censorText();
});
