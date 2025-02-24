chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "injectScript") {

    chrome.scripting.executeScript(
      {
        target: { tabId: message.tabId },
        files: [message.script],
      },
      () => {
        if (chrome.runtime.lastError) {
          console.error(" Script injection failed:", chrome.runtime.lastError);
          return;
        }


        // Wait until the content script responds before sending data
        waitForScriptReady(message.tabId, () => {
          chrome.tabs.sendMessage(message.tabId, { data: message.data }, (response) => {
            if (chrome.runtime.lastError) {
              console.error(" Message sending failed:", chrome.runtime.lastError);
            } else {
             
            }
          });
        });
      }
    );
  }
});

// Function to check if content script is ready
function waitForScriptReady(tabId, callback, retries = 5) {
  if (retries === 0) {
    console.error(" Content script did not respond after multiple attempts.");
    return;
  }

  chrome.tabs.sendMessage(tabId, { action: "checkInjected" }, (response) => {
    if (chrome.runtime.lastError || !response || !response.injected) {
     
      setTimeout(() => waitForScriptReady(tabId, callback, retries - 1), 500);
    } else {
      
      callback();
    }
  });
}
