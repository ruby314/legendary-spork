import { useEffect, useState } from "react";
import { stopCapture } from "../../lib/capture";
import type { CaptureState, User } from "../App";
import UserChip from "./UserChip";

export default function CapturingView({
  user,
  captureState,
  onStop,
  onSignOut,
}: {
  user: User;
  captureState: CaptureState;
  onStop: () => void;
  onSignOut: () => void;
}) {
  const [syncLabel, setSyncLabel] = useState("just now");

  useEffect(() => {
    if (!captureState.lastSync) return;
    function update() {
      const seconds = Math.floor((Date.now() - captureState.lastSync!) / 1000);
      if (seconds < 5) setSyncLabel("just now");
      else if (seconds < 60) setSyncLabel(`${seconds}s ago`);
      else setSyncLabel(`${Math.floor(seconds / 60)}m ago`);
    }
    update();
    const id = setInterval(update, 5000);
    return () => clearInterval(id);
  }, [captureState.lastSync]);

  async function handleStop() {
    await stopCapture();
    onStop();
  }

  const hostname = captureState.tabUrl ?? "—";

  return (
    <div className="w-72 px-6 py-5 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-base font-semibold text-gray-900">Chatter</h1>
        <UserChip user={user} onSignOut={onSignOut} />
      </div>

      <div className="rounded-lg bg-green-50 border border-green-100 px-4 py-3 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm font-medium text-green-800">Capturing</span>
        </div>
        <p className="text-sm text-gray-600 font-mono truncate">{hostname}</p>
        {captureState.lastSync && (
          <p className="text-xs text-gray-400">Last sync: {syncLabel}</p>
        )}
      </div>

      <button
        onClick={handleStop}
        className="w-full py-2.5 px-4 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors"
      >
        Stop
      </button>
    </div>
  );
}
