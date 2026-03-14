👁️ Iris: Perspective Swap
Open Iris to swap your perspective.

Iris is an open-source, decentralized Chrome Extension designed to break the algorithmic cage of modern social media. Instead of scrolling through a feed mathematically optimized to keep you in an echo chamber, Iris lets you temporarily swap your feed with a stranger's from across the globe.

Experience a different political leaning, a different socioeconomic reality, or simply a different geographic culture. Defeat the algorithm by sharing your world and borrowing someone else's.

🧠 The Philosophy
Current social media algorithms optimize for engagement, which often means outrage and isolation. Iris is a "Digital Guerrilla" project. It is not a startup; it is a statement. By creating a decentralized mesh network of anonymized feeds, we can return digital agency to the user and widen our collective worldview.

⚙️ How It Works (The "Swap")
The Scraper: As you scroll, Iris privately reads the DOM of your feed (X, Instagram, etc.).

The Scrubber: Before any data leaves your machine, an on-device, WebGPU-accelerated AI scrubs the text and images to remove Personally Identifiable Information (PII), real names, and private contacts.

The Mesh: Your sanitized feed is broadcasted to a Peer-to-Peer (P2P) network. No central servers. No corporate databases.

The Mask: When you activate "Perspective Swap," Iris hides your actual feed and injects a custom interface displaying a live feed from another random user on the mesh.

🏗️ Technical Architecture
Iris is built for resilience and privacy, utilizing modern decentralized web technologies:

Extension API: Manifest V3.

Storage / Giant Repository: Helia (IPFS for browsers) to store and distribute feed data persistently on the local machine without centralized hosting.

Discovery / Tagging: GunDB for the signaling layer. This allows users to tag their feeds (e.g., #Rural, #Tokyo, #TechOptimist) so others can request specific perspectives.

Privacy Layer: Local AI models (via WebGPU) for client-side data sanitization.

🗺️ The Roadmap (The Plan)
Phase 1: The Foundation (Current)
[x] Scaffold Manifest V3 architecture.

[x] Create the "Hide & Replace" mechanism (CSS injection & DOM manipulation).

[x] Build the basic popup UI to trigger the "Swap."

Phase 2: The Scrubber (Privacy First)
[ ] Implement MutationObserver to capture infinite-scroll feed data in real-time.

[ ] Integrate local WebGPU AI script to parse and strip out PII (names, specific locations, private handles).

[ ] Create a local "Sanitized Buffer" to hold the cleaned data before broadcasting.

Phase 3: The Decentralized Mesh (Networking)
[ ] Integrate Helia (IPFS) to allow the browser to act as a localized peer node.

[ ] Integrate GunDB for peer discovery and metadata/tag storage.

[ ] Establish WebRTC bridges for real-time feed swapping between active peers.

Phase 4: Tags & The "Tourist" Experience (UI/UX)
[ ] Add the "Tagging System" so users can self-identify their feed's vibe.

[ ] Build the "Compass Overlay" to give the viewer context on whose perspective they are currently seeing.

[ ] Implement the "Tourist Timer" (a mandatory 10-minute lockout preventing users from immediately retreating to their own echo chamber).

🛠️ How to Install (Developer Mode)
Since Iris is currently in active development, it is not yet in the Chrome Web Store. To run it locally:

Clone or download this repository.

Open Chrome and navigate to chrome://extensions/.

Toggle "Developer mode" on in the top right corner.

Click "Load unpacked" and select the iris-extension folder.

Navigate to X (Twitter) or Instagram, click the Iris icon in your toolbar, and click Open Iris.

🤝 Contributing
This is an open-source initiative. If you are passionate about digital rights, decentralized tech, or breaking algorithmic determinism, pull requests are welcome. We especially need help from developers experienced with WebRTC, Helia/IPFS browser bundling, and lightweight WebGPU AI models.

License: MIT