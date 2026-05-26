import type { User } from "../popup/App";

const STORAGE_KEY = "chatter_user";

export async function signInWithGoogle(): Promise<User | null> {
  const clientId = chrome.runtime.getManifest().oauth2?.client_id;
  const redirectUri = chrome.identity.getRedirectURL();
  const scopes = ["openid", "email", "profile"];

  const authUrl =
    "https://accounts.google.com/o/oauth2/auth?" +
    new URLSearchParams({
      client_id: clientId!,
      redirect_uri: redirectUri,
      response_type: "token",
      scope: scopes.join(" "),
    });

  return new Promise((resolve) => {
    chrome.identity.launchWebAuthFlow(
      { url: authUrl, interactive: true },
      async (redirectUrl) => {
        console.log("[Chatter] redirectUrl:", redirectUrl);
        console.log("[Chatter] lastError:", chrome.runtime.lastError?.message);
        if (chrome.runtime.lastError || !redirectUrl) {
          console.error("[Chatter] auth error:", chrome.runtime.lastError?.message);
          resolve(null);
          return;
        }

        // token is in the URL fragment
        const hash = new URL(redirectUrl).hash.slice(1);
        const params = new URLSearchParams(hash);
        const token = params.get("access_token");
        if (!token) {
          resolve(null);
          return;
        }

        try {
          const res = await fetch(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const data = await res.json();
          const user: User = {
            email: data.email,
            name: data.name,
            avatar: data.picture,
          };
          await chrome.storage.local.set({ [STORAGE_KEY]: user });
          resolve(user);
        } catch (err) {
          console.error("[Chatter] failed to fetch user info:", err);
          resolve(null);
        }
      }
    );
  });
}

export async function getStoredUser(): Promise<User | null> {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  return (result[STORAGE_KEY] as User) ?? null;
}

export async function signOut(): Promise<void> {
  await chrome.storage.local.remove(STORAGE_KEY);
  // Revoke the cached token so Chrome doesn't auto-reuse it
  chrome.identity.getAuthToken({ interactive: false }, (token) => {
    if (token) chrome.identity.removeCachedAuthToken({ token });
  });
}
