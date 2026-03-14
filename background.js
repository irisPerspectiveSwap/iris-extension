console.log('🧠 Iris Service Worker: Brain online.');

// This is our temporary Regex scrubber while we wire up the local WebGPU AI
const basicScrub = (text) => {
  let scrubbed = text;
  
  // Strip out @ mentions
  scrubbed = scrubbed.replace(/@[a-zA-Z0-9_]+/g, '[USER]');
  
  // Strip out URLs
  scrubbed = scrubbed.replace(/https?:\/\/\S+/g, '[LINK]');
  
  return scrubbed;
};

// Listen for captured posts from the content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "SCRUB_TEXT") {
    const rawText = request.payload.text;
    
    // Pass it through the scrubber
    const sanitizedText = basicScrub(rawText);
    
    console.log(`🧼 SCRUBBED [${request.payload.id}]:`, sanitizedText.replace(/\n/g, " | "));
    
    // In the future, this is where we will broadcast sanitizedText to the IPFS/Helia Mesh!
  }
});