console.log("Iris is watching...");

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
