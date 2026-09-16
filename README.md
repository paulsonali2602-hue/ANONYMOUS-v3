# ANONYMOUS - SURVIVAL V2

This version fixes the main prototype problems and changes the game to a third-person mobile survival-horror format with an asymmetrical-horror-inspired feel.

## Important
The game uses a grayscale visual language and does not copy another game's assets or UI.

## Main changes
- Real third-person camera behind the player
- Character proportions based on the supplied block-character reference
- Visible moonlit environment instead of an almost-black scene
- Brighter terrain, cabin, trees, rocks, stars and moon
- Cabin window/porch lighting
- Working Web Audio that is explicitly resumed from a user interaction
- Button click sounds
- Jump sound
- Procedural footsteps
- Danger warning sound
- A simple pursuing "Watcher" threat
- Threat meter
- Mobile joystick
- Mobile right-side camera-look zone
- Desktop WASD/arrow controls
- Space to jump
- 2-minute survival timer
- Zone Sealed / New Lobby ending
- Settings and player customization saved locally

## Run on Android
1. Extract the ZIP.
2. Put the folder on GitHub Pages, Netlify, or another web host, or use a local web server.
3. Open `index.html`.
4. Rotate to landscape.
5. Tap START SURVIVAL once. This first tap unlocks Web Audio on mobile browsers.

Three.js is loaded from jsDelivr, so the page needs internet access unless you replace the CDN script with a local Three.js copy.
