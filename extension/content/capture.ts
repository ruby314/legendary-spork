// Injected into the active tab when user enables capture.
// Sends visible text to the background service worker.

function extractText(): string {
  // innerText respects CSS visibility — hidden elements are excluded
  return document.body.innerText ?? "";
}

chrome.runtime.sendMessage({
  type: "TEXT_CAPTURED",
  text: extractText(),
});
