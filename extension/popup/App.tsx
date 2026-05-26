import { useEffect, useState } from "react";
import { getStoredUser, signOut } from "../lib/auth";
import { getCapturingState } from "../lib/capture";
import LoginView from "./components/LoginView";
import IdleView from "./components/IdleView";
import CapturingView from "./components/CapturingView";

export type User = { email: string; name: string; avatar?: string };

export type CaptureState = {
  capturing: boolean;
  tabUrl: string | null;
  lastSync: number | null;
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [captureState, setCaptureState] = useState<CaptureState>({
    capturing: false,
    tabUrl: null,
    lastSync: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const storedUser = await getStoredUser();
      setUser(storedUser);

      const state = await getCapturingState();
      setCaptureState(state);

      setLoading(false);
    }
    init();

    // listen for capture state changes from background
    const listener = (msg: { type: string; state?: CaptureState }) => {
      if (msg.type === "CAPTURE_STATE_CHANGED" && msg.state) {
        setCaptureState(msg.state);
      }
    };
    chrome.runtime.onMessage.addListener(listener);
    return () => chrome.runtime.onMessage.removeListener(listener);
  }, []);

  function handleSignOut() {
    signOut().then(() => setUser(null));
  }

  if (loading) {
    return (
      <div className="w-72 h-36 flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <LoginView onSignIn={setUser} />;
  }

  if (captureState.capturing) {
    return (
      <CapturingView
        user={user}
        captureState={captureState}
        onStop={() =>
          setCaptureState((s) => ({ ...s, capturing: false, lastSync: null }))
        }
        onSignOut={handleSignOut}
      />
    );
  }

  return (
    <IdleView
      user={user}
      onCapture={(tabUrl) =>
        setCaptureState({ capturing: true, tabUrl, lastSync: null })
      }
      onSignOut={handleSignOut}
    />
  );
}
