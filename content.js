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
    // 1. Hide the echo chamber
    feed.style.display = 'none'; 
    document.body.appendChild(irisOverlay);
    console.log("Echo chamber successfully blurred. Requesting peer feed...");

    const container = irisOverlay.querySelector('.iris-container');

    // 2. Ask the Brain for a feed from the Decentralized Mesh
    chrome.runtime.sendMessage({ action: "REQUEST_SWAP" }, (response) => {
      if (response && response.success) {
        // Paint the Stranger's Feed
        container.innerHTML = `
          <h1>Perspective Swapped 👁️</h1>
          <p style="color: #888; margin-bottom: 20px;">You are viewing a live, unfiltered feed from a random peer.</p>
          <div id="peer-feed" style="text-align: left; max-height: 70vh; overflow-y: auto; background: #111; padding: 20px; border-radius: 8px;"></div>
          <button onclick="window.location.reload()" style="margin-top:20px; padding: 10px 20px; background: white; color: black; border-radius: 5px; cursor: pointer; border: none;">Return to Reality</button>
        `;
        
        const feedDiv = container.querySelector('#peer-feed');
        
        // Loop through the peer's posts and render them
        response.feed.reverse().forEach(post => {
           const postEl = document.createElement('div');
           postEl.style.cssText = 'padding: 15px; border-bottom: 1px solid #333; margin-bottom: 10px; font-size: 15px; line-height: 1.5;';
           postEl.innerText = post.text;
           feedDiv.appendChild(postEl);
        });
      } else {
        // No peers found
        container.innerHTML = `
          <h1>Network Empty</h1>
          <p style="color: #888; margin-top: 10px;">${response ? response.message : "Error connecting to Brain."}</p>
          <button onclick="window.location.reload()" style="margin-top:20px; padding: 10px 20px; background: white; color: black; border-radius: 5px; cursor: pointer; border: none;">Return to Reality</button>
        `;
      }
    });
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
  const textElement = articleElement.querySelector('[data-testid="tweetText"]'); 
  
  if (textElement) {
    const postText = textElement.innerText;
    const postId = btoa(encodeURIComponent(postText).substring(0, 20)).substring(0, 10); 
    
    if (!scrapedPosts.has(postId)) {
      scrapedPosts.add(postId);
      
      console.log("🪝 Captured Post (Sending to Brain):", postText.replace(/\n/g, " | ")); 
      
      // NEW: Send the raw text to the background service worker for scrubbing
      chrome.runtime.sendMessage({
        action: "SCRUB_TEXT",
        payload: { id: postId, text: postText }
      });
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