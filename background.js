// Trick GunDB into thinking it has a browser window
var window = self;
var global = self;

// Import the locally bundled Gun library
importScripts('gun.js');

console.log('🧠 Iris Service Worker: Brain online (Unfiltered Mode).');

// Initialize the Peer-to-Peer node
const peers = ['https://gun-manhattan.herokuapp.com/gun'];
const gun = Gun({ peers: peers });

// Create a dedicated channel for Iris users to share perspectives
const irisMesh = gun.get('iris-perspective-swap-mesh');

// The Staging Area: Holds the last 50 posts you've seen
const localFeedBuffer = [];
const MAX_BUFFER_SIZE = 50;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
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
    
    console.log(`📥 BUFFERED [${localFeedBuffer.length}/${MAX_BUFFER_SIZE}]:`, rawText.replace(/\n/g, " ").substring(0, 60) + "...");

    // Broadcast the local node's status to the mesh
    irisMesh.get('active_nodes').get('my-local-node').put({
      status: 'online',
      bufferSize: localFeedBuffer.length,
      lastUpdate: Date.now()
    });
  }
});

// Listen to the mesh for other nodes offering to share their feed
irisMesh.get('active_nodes').map().on((data, nodeId) => {
  if (data && nodeId !== 'my-local-node') {
    console.log(`📡 MESH RADAR: Found peer [${nodeId}] with ${data.bufferSize} posts ready to swap.`);
  }
});