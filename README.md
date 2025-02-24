# facebook-marketplace-assistant-chrome-extension
A simple poc for a conceptual extension project for Google Chrome to be used with the Facebook Marketplace

## How to run the backend
### With Docker
1. Make sure you have Docker and Make available on your system.
2. Go into the `/backend` directory.
3. Run `make start`.
4. Done :)

### Without Docker
1. Make sure you have Node.js v20 available on your system.
2. Go into the `/backend` directory.
3. Run `npm i && npm run start`
4. Done :)

## How to use the Chrome Extension
1. On Google Chrome (or any chrome based browser), click the top right three-dot menu and go to `Extensions`.
2. On the top right corner of the screen, toggle the "Developer Mode" switch to "On".
3. A new toolbar will appear right below the top search bar, containing buttons like "Load Unpacked", "Pack Extension",
   "Update", etc.
4. Click "Load Unpacked", a file browser will open, select the `/extension` directory.
5. The Extension should appear in the installed extensions list as "Marketplace Assistant".
6. You can now pin the extension on your browser toolbar.
7. Go to [https://www.facebook.com/marketplace/create/item](https://www.facebook.com/marketplace/create/item) and click
   the pinned extension icon, and click the "Upload" button for any item.
8. You will see the product information being input in real-time.