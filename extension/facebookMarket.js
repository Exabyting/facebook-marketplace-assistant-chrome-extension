if (!window.facebookMarketInjected) {
  window.facebookMarketInjected = true;

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "checkInjected") {
      sendResponse({ injected: true });
    } else if (message.action === "processData") {
      uploadProduct(message.product);
    }
    return true;
  });
}

async function uploadProduct(product) {
  try {
    await uploadImage(product);
    await uploadField("title", product.title);
    await uploadField("price", product.price);
    await uploadCategory("Category", product.category);
    await uploadCondition("Condition", product.condition);
    await clickNextButton("Next");
    await clickPublishButton("Publish");
  } catch (error) {
    console.error("Error uploading product:", error);
  }
}

async function fetchImageAsBase64(url) {
  const response = await fetch(url);
  if (!response.ok)
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function uploadImage(product) {
  try {
    const imageBase64 = await fetchImageAsBase64(product.thumbnail);
    const fileInput = document.querySelector('input[type="file"]');
    if (!fileInput) throw new Error("File input not found");

    const [meta, base64Data] = imageBase64.split(",");
    const binaryData = Uint8Array.from(atob(base64Data), (char) =>
      char.charCodeAt(0)
    );
    const file = new File(
      [new Blob([binaryData], { type: "image/jpeg" })],
      "image.jpg",
      { type: "image/jpeg" }
    );

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    fileInput.files = dataTransfer.files;
    fileInput.dispatchEvent(new Event("change", { bubbles: true }));
  } catch (error) {
    console.error("Error uploading image:", error);
  }
}

async function uploadField(labelText, value) {
  const labelSpan = [...document.querySelectorAll("span")].find((span) =>
    span.textContent.trim().toLowerCase().includes(labelText.toLowerCase())
  );
  if (!labelSpan) return console.error(`${labelText} label not found`);

  const input = labelSpan.closest("div").querySelector("input");
  if (!input) return console.error(`${labelText} input not found`);

  input.focus();
  input.value = String(value); // Ensure value is a string
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

async function uploadCategory(labelText, optionText) {
  const label = [...document.querySelectorAll("span")].find(
    (span) => span.textContent.trim() === labelText
  );
  if (!label) return console.error(`${labelText} label not found`);

  label.click();

  await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for dropdown to appear
  const option = [
    ...document.querySelectorAll('div[aria-label="Dropdown menu"] span'),
  ].find(
    (span) =>
      span.textContent.trim().toLowerCase() === optionText.trim().toLowerCase()
  );

  if (option) option.closest("div")?.click();
  else console.error(`${optionText} option not found`);
}

async function uploadCondition(labelText, optionText) {
  const label = [...document.querySelectorAll("span")].find(
    (span) => span.textContent.trim() === labelText
  );
  if (!label) return console.error(`${labelText} label not found`);

  label.click();

  await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for dropdown to appear
  const option = [
    ...document.querySelectorAll('div[aria-label="Select an option"] span'),
  ].find(
    (span) =>
      span.textContent.trim().toLowerCase() === optionText.trim().toLowerCase()
  );

  if (option) option.closest("div")?.click();
  else console.error(`${optionText} option not found`);
}

async function clickNextButton(buttonText) {
  setTimeout(() => {
    const button = [
      ...document.querySelectorAll('div[aria-label="Next"] span'),
    ].find(
      (span) =>
        span.textContent.trim().toLowerCase() ===
        buttonText.trim().toLowerCase()
    );
    if (button) {
      button.closest("button, div")?.click();
    } else {
      console.error(`${buttonText} button not found`);
    }
  }, 3000);
}

async function clickPublishButton(buttonText) {
  setTimeout(() => {
    const button = [
      ...document.querySelectorAll('div[aria-label="Publish"] span'),
    ].find(
      (span) =>
        span.textContent.trim().toLowerCase() ===
        buttonText.trim().toLowerCase()
    );
    if (button) {
      button.closest("button, div")?.click();
    } else {
      console.error(`${buttonText} button not found`);
    }
  }, 5000);
}
