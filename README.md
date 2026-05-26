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
# Create your local env file from the example
cp .env.example .env
# Edit .env and paste your client ID
```

Then build and load:

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

### 5. Rebuild and reload

```bash
npm run build
```

Click the refresh icon (↺) on the Chatter card in `chrome://extensions`.

## Usage

1. Click the Chatter icon in the Chrome toolbar (puzzle piece → Chatter)
2. Sign in with Google
3. Navigate to any webpage
4. Click **Enable capture** — the popup turns green when active
5. Captured text is logged in the service worker console (`chrome://extensions` → Service worker → DevTools)

## Development

```bash
npm run dev   # watch mode — rebuilds on file changes
```

After each rebuild, click ↺ in `chrome://extensions` to reload.

## Environment

The client ID is kept out of version control. Copy `.env.example` to `.env` and fill in your value:

```
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

`manifest.json` is generated from `manifest.template.json` at build time — do not edit `manifest.json` directly.

## Project structure

```
extension/
  manifest.template.json  Chrome MV3 config template (committed)
  .env.example            Environment variable template (committed)
  .env                    Local secrets — not committed
  popup/                  React UI (3 states: login, idle, capturing)
  background/             Service worker — handles auth tokens, message passing
  content/                Injected into tab to extract document.body.innerText
  lib/                    Auth (Google OAuth) and capture helpers
```
