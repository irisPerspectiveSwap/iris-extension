document.getElementById('openIrisBtn').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.id) {
    chrome.tabs.sendMessage(tab.id, { action: 'START_SWAP' }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Iris:', chrome.runtime.lastError.message);
      } else if (response) {
        console.log('Iris:', response.status);
      }
    });
  }
});
