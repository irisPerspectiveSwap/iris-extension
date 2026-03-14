console.log("👁️ Iris is active. Watching the feed...");

// --- 1. THE UI MASK ---
const irisOverlay = document.createElement('div');
irisOverlay.id = 'iris-world-view';
irisOverlay.innerHTML = `
  <div class="iris-container">
    <h1>You are now looking through the Iris.</h1>
    <p>Waiting for a feed from the decentralized mesh...</p>
  </div>
`;

const startSwap = () => {
  const feed = document.querySelector('main') || document.querySelector('section');
  if (feed) {
    feed.style.display = 'none'; 
    document.body.appendChild(irisOverlay);
    console.log("Echo chamber successfully blurred. Loading world view...");
  }
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "START_SWAP") {
    startSwap();
    sendResponse({status: "Swap initiated"});
  }
});


// --- 2. THE GHOST READER (The Scraper) ---
const scrapedPosts = new Set(); // Prevents reading the same post twice

const parsePost = (articleElement) => {
  // X (Twitter) wraps tweet text in a div with this specific data-testid
  const textElement = articleElement.querySelector('[data-testid="tweetText"]'); 
  
  if (textElement) {
    const postText = textElement.innerText;
    
    // Create a unique ID for the post to avoid duplicates
    const postId = btoa(encodeURIComponent(postText).substring(0, 20)).substring(0, 10); 
    
    if (!scrapedPosts.has(postId)) {
      scrapedPosts.add(postId);
      
      // Log the captured post (We will send this to the AI Scrubber later)
      console.log("🪝 Captured Post:", postText.replace(/\n/g, " | ")); 
    }
  }
};

// Set up the stakeout to watch for new posts as the user scrolls
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length) {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) { // 1 = HTML Element
          if (node.tagName === 'ARTICLE') {
            parsePost(node);
          } else if (node.querySelectorAll) {
            const articles = node.querySelectorAll('article');
            articles.forEach(parsePost);
          }
        }
      });
    }
  });
});

// Start watching the page
observer.observe(document.body, {
  childList: true, 
  subtree: true    
});