import type { CaptureState } from "../popup/App";

let captureState: CaptureState = {
  capturing: false,
  tabUrl: null,
  lastSync: null,
};

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  switch (msg.type) {
    case "GET_CAPTURE_STATE":
      sendResponse(captureState);
      break;

    case "START_CAPTURE":
      handleStartCapture(msg.tabId).then(() => sendResponse({ ok: true }));
      return true; // async

    case "STOP_CAPTURE":
      captureState = { capturing: false, tabUrl: null, lastSync: null };
      broadcastState();
      sendResponse({ ok: true });
      break;

    case "TEXT_CAPTURED":
      captureState = { ...captureState, lastSync: Date.now() };
      broadcastState();
      // TODO: forward msg.text to your backend / storage
      console.log("[Chatter] captured text length:", msg.text?.length);
      console.log("[Chatter] captured text:", msg.text);
      sendResponse({ ok: true });
      break;
  }
});

async function handleStartCapture(tabId: number) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const id = tabId ?? tab?.id;
  if (!id) return;

  let hostname = "";
  try {
    hostname = tab?.url ? new URL(tab.url).hostname : "";
  } catch {
    hostname = tab?.url ?? "";
  }

  captureState = { capturing: true, tabUrl: hostname, lastSync: null };
  broadcastState();

  await chrome.scripting.executeScript({
    target: { tabId: id },
    files: ["content.js"],
  });
}

function broadcastState() {
  chrome.runtime.sendMessage({ type: "CAPTURE_STATE_CHANGED", state: captureState }).catch(() => {
    // popup may be closed — safe to ignore
  });
}
