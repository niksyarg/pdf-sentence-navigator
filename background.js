chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

  if (changeInfo.status === 'complete' && tab.url && tab.url.includes('.pdf')) {
    console.log("PDF detected by background script in tab:", tabId);
    
  
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content.js']
    }).catch(err => console.log("Script injection skipped or handled: ", err));
  }
});