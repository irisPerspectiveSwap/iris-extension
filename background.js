// Trick GunDB into thinking it has a browser window
var window = self;
var global = self;

// Import the locally bundled Gun library
importScripts('gun.js');

console.log('🧠 Iris Service Worker: Brain online (Unfiltered Mode).');

// Initialize the Peer-to-Peer node
// Initialize the Peer-to-Peer node with fresh community relays
const peers = [
  'http://localhost:8765/gun',
  'https://relay.peer.ooo/gun' // We'll keep the one public node that survived as a backup!
];
const gun = Gun({ peers: peers });

// Create a dedicated channel for Iris users to share perspectives
const irisMesh = gun.get('iris-perspective-swap-mesh');

// NEW: Generate a random, unique ID for this specific browser
const MY_NODE_ID = 'iris-node-' + Math.random().toString(36).substr(2, 9);
console.log(`🤖 My Unique Mesh ID: ${MY_NODE_ID}`);

// The Staging Area: Holds the last 50 posts you've seen
const localFeedBuffer = [];
const MAX_BUFFER_SIZE = 50;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // 1. Handling outgoing data (Scraping)
  if (request.action === "SCRUB_TEXT") { 
    const rawText = request.payload.text;
    
    localFeedBuffer.push({
      id: request.payload.id,
      text: rawText,
      timestamp: Date.now()
    });

    if (localFeedBuffer.length > MAX_BUFFER_SIZE) {
      localFeedBuffer.shift(); 
    }
    
    // Broadcast the local node's status to the mesh
    irisMesh.get('active_nodes').get(MY_NODE_ID).put({
      status: 'online',
      bufferSize: localFeedBuffer.length,
      lastUpdate: Date.now(),
      feed: JSON.stringify(localFeedBuffer) 
    });
  }

  // 2. Handling incoming data (The Swap)
  if (request.action === "REQUEST_SWAP") {
    let foundFeed = false;
    
    // Scan the mesh for an active peer
    irisMesh.get('active_nodes').map().once((data, nodeId) => {
      // Find the first peer that isn't us, and has a feed
      if (!foundFeed && data && nodeId !== MY_NODE_ID && data.feed) {
         foundFeed = true;
         console.log(`👁️ Swapping perspective with peer: ${nodeId}`);
         sendResponse({ success: true, feed: JSON.parse(data.feed) });
      }
    });

    // If no peers are found after 2 seconds, return a fallback message
    setTimeout(() => {
      if (!foundFeed) {
         sendResponse({ success: false, message: "No active peers found on the mesh. Keep scrolling to seed the network!" });
      }
    }, 2000);
    
    return true; // Keeps the message channel open for the async GunDB response
  }
});

// Listen to the mesh for other nodes offering to share their feed
irisMesh.get('active_nodes').map().on((data, nodeId) => {
  if (data && nodeId !== 'my-local-node') {
    console.log(`📡 MESH RADAR: Found peer [${nodeId}] with ${data.bufferSize} posts ready to swap.`);
  }
});