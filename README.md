# Learning Journal PWA 🚀

A Progressive Web App that documents my Mobile Application Development learning journey, built with a Flask backend and modern web technologies. Now features a fully functional arcade game and offline capabilities!

## 🚀 Live Demo

**Live Site:** https://thaparojin.pythonanywhere.com

## 📖 About This Project

This is my learning journal and portfolio for the FGCT6021 Mobile Application Development unit. It has evolved from a simple static site into a full-stack Progressive Web App (PWA) with a custom-built game engine and complete offline support.

### ✨ Features

- **🎮 Cyber Defender Game (Mini Project)** - A fully functional retro space shooter built with HTML5 Canvas. Features collision detection, particle explosions, and a 60FPS game loop.
- **🕹️ Hybrid Control System** - Auto-detects device type to switch between Keyboard controls (PC) and a custom "Mega Console" touch D-Pad (Mobile).
- **📱 Modern Dashboard UI** - Redesigned homepage with a "Hero" gradient header and large, touch-friendly Quick Access cards for better mobile usability.
- **📝 Journal Entries** - Weekly reflections on learning progress.
- **🔗 Flask Backend** - Full-stack functionality with API routes for data persistence.
- **💾 Data Persistence** - Reflections saved to JSON file on server; Game high scores saved to LocalStorage.
- **📡 Offline Support** - Works without internet using Service Workers ("Network First" strategy).
- **⚡ Installable PWA** - Add to Home Screen via Web Manifest for a native app feel.

## 🛠️ Technology Stack

- **Frontend:** HTML5, CSS3 (Grid/Flexbox), JavaScript (ES6+)
- **Game Engine:** HTML5 Canvas API, RequestAnimationFrame
- **PWA:** Service Workers, Cache API, Web Manifest
- **Backend:** Python, Flask
- **Deployment:** PythonAnywhere
- **Storage:** Server-side JSON Database & Client-side LocalStorage

## 📁 Project Structure

```text
Learning-journal-PWA/
├── flask_app.py            # Main Flask application
├── templates/              # HTML pages
│   ├── index.html          # Modern Dashboard Home
│   ├── journal.html        # Journal with Flask form
│   ├── game.html           # Cyber Defender Game Canvas
│   ├── projects.html       # Project portfolio
│   └── about.html          # About me page
├── static/
│   ├── manifest.json       # PWA Install Manifest
│   ├── css/
│   │   └── style.css       # Main styling (Dark Mode & Game UI)
│   ├── js/
│   │   ├── sw.js           # Service Worker (Offline Logic)
│   │   ├── game.js         # Game Engine & Control Logic
│   │   ├── script.js       # Navigation, Theme, Network Status
│   │   ├── json-handler.js # Flask API communication
│   │   ├── storage.js      # localStorage functions
│   │   ├── browser.js      # Browser API features
│   │   └── thirdparty.js   # YouTube API integration
│   ├── images/             # Icons & Assets
│   └── backend/
│       └── reflections.json # Data storage (auto-created)


```



## 🎯 How to Use

1. **Visit the Site:** Open the link in your browser.
2. **Install App:** Look for the "Install" icon in your URL bar or select "Add to Home Screen" on your mobile browser.
3. **Play the Game:** Tap the "Cyber Defender" card on the home screen. Use arrow keys (PC) or the on-screen D-Pad (Mobile) to play.
4. **Write Entry:** Go to the Journal page and save a reflection (this saves directly to the Flask backend).
5. **Go Offline:** Turn off your internet—the app will still load, and you can read your entries or play the game!
6. **Export Data:** Download your reflections as a JSON file for backup.

## ⚙️ Local Development Setup

If you want to run this locally on your machine, follow these steps:

1. **Clone the repository**
   ```bash
   git clone https://github.com/rojinthapa/Learning-journal-PWA

2. **Install dependencies**
   ```
   pip install flask

3. **Run the application**
   ```
   python flask_app.py
4. **Open browser**
   ```
   http://localhost:5000
