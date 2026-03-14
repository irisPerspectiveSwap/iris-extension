console.log('🧠 Iris Service Worker: Brain online (Unfiltered Mode).');

// The Staging Area: Holds the last 50 posts you've seen
const localFeedBuffer = [];
const MAX_BUFFER_SIZE = 50;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "SCRUB_TEXT") { // We'll keep the action name the same so we don't have to edit content.js
    const rawText = request.payload.text;
    
    // Push the raw post into the buffer
    localFeedBuffer.push({
      id: request.payload.id,
      text: rawText,
      timestamp: Date.now()
    });

    // Keep the buffer lightweight so it doesn't crash the browser
    if (localFeedBuffer.length > MAX_BUFFER_SIZE) {
      localFeedBuffer.shift(); // Drops the oldest post
    }
    
    console.log(`📥 BUFFERED [${localFeedBuffer.length}/${MAX_BUFFER_SIZE}]:`, rawText.replace(/\n/g, " ").substring(0, 60) + "...");
  }
});