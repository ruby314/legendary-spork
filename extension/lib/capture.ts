import type { CaptureState } from "../popup/App";

export async function getCapturingState(): Promise<CaptureState> {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: "GET_CAPTURE_STATE" }, (state) => {
      resolve(
        state ?? { capturing: false, tabUrl: null, lastSync: null }
      );
    });
  });
}

export async function startCapture(): Promise<void> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(
      { type: "START_CAPTURE", tabId: tab?.id },
      () => resolve()
    );
  });
}

export async function stopCapture(): Promise<void> {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: "STOP_CAPTURE" }, () => resolve());
  });
}
