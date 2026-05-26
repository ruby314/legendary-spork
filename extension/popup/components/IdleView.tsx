import { useEffect, useState } from "react";
import { startCapture } from "../../lib/capture";
import type { User } from "../App";
import UserChip from "./UserChip";

export default function IdleView({
  user,
  onCapture,
  onSignOut,
}: {
  user: User;
  onCapture: (tabUrl: string) => void;
  onSignOut: () => void;
}) {
  const [tabHostname, setTabHostname] = useState<string | null>(null);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      if (tab?.url) {
        try {
          setTabHostname(new URL(tab.url).hostname);
        } catch {
          setTabHostname(tab.url);
        }
      }
    });
  }, []);

  async function handleEnable() {
    const tabUrl = tabHostname ?? "";
    await startCapture();
    onCapture(tabUrl);
  }

  return (
    <div className="w-72 px-6 py-5 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-base font-semibold text-gray-900">Chatter</h1>
        <UserChip user={user} onSignOut={onSignOut} />
      </div>

      <div className="rounded-lg bg-gray-50 border border-gray-100 px-4 py-3">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Current tab</p>
        <p className="text-sm text-gray-700 truncate font-mono">
          {tabHostname ?? "—"}
        </p>
      </div>

      <button
        onClick={handleEnable}
        disabled={!tabHostname}
        className="w-full py-2.5 px-4 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 active:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Enable capture
      </button>
    </div>
  );
}
