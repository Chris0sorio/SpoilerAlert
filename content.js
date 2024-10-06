console.log('Content script loaded');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'censorTerms') {
    const movies = request.movies;
    console.log('Movies received in content script:', movies);

    const termsToCensor = new Set([
      ...(movies.titles || []),
      ...(movies.actors || []),
      ...(movies.characters || []),
      ...(movies.directors || [])
    ]);

    console.log('Terms to censor:', Array.from(termsToCensor));

    const combinedPattern = Array.from(termsToCensor)
      .filter(Boolean)
      .map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) // Escape special regex characters
      .join('|');

    // Match sentences containing the terms
    const termRegex = new RegExp(`\\b(${combinedPattern})(?: \\(.*?\\))?\\b`, 'gi');

    console.log('Regex pattern:', termRegex);

    // Traverse all text nodes
    const textNodes = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    let node;

    while (node = textNodes.nextNode()) {
      const originalText = node.textContent;

      // Replace only if a term is found
      if (termRegex.test(originalText)) {
        console.log(`Censoring: "${originalText}"`);

        // Replace the matches with asterisks of the same length
        const censoredText = originalText.replace(termRegex, match => {
          return '*'.repeat(match.length); // Replace with asterisks
        });

        // Update the node's text
        node.textContent = censoredText;
      }
    }

    sendResponse({ status: 'Censoring complete' });
  }
});
