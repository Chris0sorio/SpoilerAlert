console.log('Content script loaded');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'censorTerms') {
    const movies = request.movies;
    console.log('Movies received in content script:', movies);

    // Collect unique titles, actors, characters, and directors
    const termsToCensor = new Set([
      ...movies.titles,
      ...movies.actors,
      ...movies.characters,
      ...movies.directors
    ]);

    // Create a regex pattern to match any of the movie terms
    const combinedPattern = Array.from(termsToCensor).filter(Boolean).join('|');
    const termRegex = new RegExp(`\\b(${combinedPattern})\\b`, 'gi');

    // Traverse all text nodes and censor terms
    const textNodes = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    let node;
    while (node = textNodes.nextNode()) {
      if (termRegex.test(node.textContent)) {
        // Censor detected terms
        node.textContent = node.textContent.replace(termRegex, '****');
      }
    }

    sendResponse({ status: 'Censoring complete' });
  }
});
