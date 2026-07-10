chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

  if (changeInfo.status === 'loading' && tab.url) {
    const url = tab.url.toLowerCase();
    
    if (url.includes('.pdf') && !url.startsWith(chrome.runtime.getURL(''))) {
      
      const viewerUrl = chrome.runtime.getURL('viewer.html') + '?url=' + encodeURIComponent(tab.url);
      
      chrome.tabs.update(tabId, { url: viewerUrl });
    }
  }
});