// Get the container where we will insert the table data
const API_ENDPOINT = "http://localhost:3001/products";
const tableBody = document.getElementById("tableBody");
let productsData = [];

// Function to populate the table in the pop-up
function populateTable() {
  fetch(API_ENDPOINT)
    .then((response) => response.json())
    .then((data) => {
      tableBody.innerHTML = "";

      // Store product data
      productsData = data;

      productsData.forEach((product) => {
        const row = document.createElement("tr");

        row.innerHTML = `
          <td><img src="${product.thumbnail}" alt="${
          product.title
        }" width="50"></td>
          <td>${product.title}</td>
          <td>$${product.price.toFixed(2)}</td>
          <td>${product.category}</td>
        `;

        // Create the button dynamically and add an event listener
        const buttonTd = document.createElement("td");
        const button = document.createElement("button");
        button.textContent = "Upload";
        button.className = "btn btn-primary";
        button.addEventListener("click", () => handleUploadClick(product.id));

        buttonTd.appendChild(button);
        row.appendChild(buttonTd);

        tableBody.appendChild(row);
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

populateTable();

// Function to handle button click
function handleUploadClick(productId) {

  const singleProductData = productsData.find(
    (product) => product.id === productId
  );



  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs.length === 0) return;
    let currentTab = tabs[0];
    let currentUrl = currentTab.url;

    const urlObj = new URL(currentUrl);
    const hostname = urlObj.hostname;

    if (hostname === "facebook.com" || hostname === "www.facebook.com") {
      checkAndInjectScript(currentTab.id, singleProductData);
    }
  });
}

// Function to check and inject script only if needed
function checkAndInjectScript(tabId, productData) {
  chrome.tabs.sendMessage(tabId, { action: "checkInjected" }, (response) => {
    if (chrome.runtime.lastError) {
      console.warn("No response from content script. Injecting now...");
      injectAndSendMessage(tabId, productData);
      return;
    }

    if (!response || !response.injected) {
 
      injectAndSendMessage(tabId, productData);
    } else {
     
      sendMessageToContentScript(tabId, productData);
    }
  });
}

// Function to inject the script and then send data
function injectAndSendMessage(tabId, productData) {
  chrome.scripting.executeScript(
    {
      target: { tabId: tabId },
      files: ["facebookMarket.js"],
    },
    () => {
      if (chrome.runtime.lastError) {
        console.error("Script injection failed:", chrome.runtime.lastError);
        return;
      }

  
      waitForScript(tabId, () =>
        sendMessageToContentScript(tabId, productData)
      );
    }
  );
}

// Function to wait until content script is ready
function waitForScript(tabId, callback, retries = 5) {
  if (retries === 0) {
    console.error("Content script did not respond after multiple attempts.");
    return;
  }

  chrome.tabs.sendMessage(tabId, { action: "checkInjected" }, (response) => {
    if (chrome.runtime.lastError || !response || !response.injected) {
 
      setTimeout(() => waitForScript(tabId, callback, retries - 1), 500);
    } else {
   
      callback();
    }
  });
}

// Function to send data to the injected script
function sendMessageToContentScript(tabId, productData) {
  chrome.tabs.sendMessage(
    tabId,
    { action: "processData", product: productData },
    (response) => {
      if (chrome.runtime.lastError) {
        console.error("Failed to send message:", chrome.runtime.lastError);
      } else {

      }
    }
  );
}