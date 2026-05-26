# Chatter

Browser extension that captures visible text from the current tab with user permission.

## Setup

### 1. Install dependencies

```bash
cd extension
npm install
```

### 2. Google Cloud Platform — OAuth client

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project (or select an existing one)
3. **APIs & Services** → **OAuth consent screen**
   - User type: External
   - Fill in app name, support email, developer email → Save
4. **APIs & Services** → **Credentials** → **Create Credentials** → **OAuth client ID**
   - Application type: **Web application**
   - Under **Authorized redirect URIs**, add your extension's redirect URI (see step 4 below to get this)
   - Save → copy the **Client ID**

### 3. Build and load the extension

```bash
npm run build
```

1. Open `chrome://extensions`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked** → select the `extension/dist` folder
4. Note the **Extension ID** shown under the extension name

### 4. Get the redirect URI

1. In `chrome://extensions`, click **Service worker** next to Chatter
2. In the console that opens, run:
   ```js
   chrome.identity.getRedirectURL()
   ```
3. Copy the returned URL (e.g. `https://<extension-id>.chromiumapp.org/`)
4. Go back to your OAuth client in GCP and add this URL under **Authorized redirect URIs**

### 5. Add the client ID to the extension

In `extension/manifest.json`, replace the placeholder:

```json
"oauth2": {
  "client_id": "YOUR_CLIENT_ID.apps.googleusercontent.com",
  "scopes": ["openid", "email", "profile"]
}
```

### 6. Rebuild and reload

```bash
npm run build
```

Click the refresh icon (↺) on the Chatter card in `chrome://extensions`.

## Usage

1. Click the Chatter icon in the Chrome toolbar (puzzle piece → Chatter)
2. Sign in with Google
3. Navigate to any webpage
4. Click **Enable capture** — the popup turns green when active
5. Captured text is logged in the service worker console (Service worker → DevTools)

## Development

```bash
npm run dev   # watch mode — rebuilds on file changes
```

After each rebuild, click ↺ in `chrome://extensions` to reload.

## Project structure

```
extension/
  manifest.json          Chrome MV3 config
  popup/                 React UI (3 states: login, idle, capturing)
  background/            Service worker — handles auth tokens, message passing
  content/               Injected into tab to extract document.body.innerText
  lib/                   Auth (Google OAuth) and capture helpers
```
