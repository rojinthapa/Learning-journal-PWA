# Learning Journal PWA

A Progressive Web App that documents my Mobile Application Development learning journey, built with Flask backend and modern web technologies. Now fully installable with offline capabilities!

## 🚀 Live Demo

**Live Site:** https://thaparojin.pythonanywhere.com

## 📖 About This Project

This is my learning journal and portfolio for the FGCT6021 Mobile Application Development unit. It has evolved from a simple static site into a full-stack Progressive Web App (PWA) with offline support.

### ✨ Features

- **📝 Journal Entries** - Weekly reflections on learning progress
- **🎨 Beautiful UI** - Responsive design with dark/light theme
- **🔗 Flask Backend** - Full-stack functionality with API routes
- **💾 Data Persistence** - Reflections saved to JSON file on server
- **📱 Fully Installable** - Add to Home Screen via Web Manifest
- **📡 Offline Support** - Works without internet using Service Workers
- **⚡ Smart Caching** - "Network First" strategy for dynamic content

## 🛠️ Technology Stack

- **Frontend:** HTML5, CSS3, JavaScript
- **PWA:** Service Workers, Cache API, Web Manifest
- **Backend:** Python, Flask
- **Deployment:** PythonAnywhere
- **Storage:** JSON file database

## 📁 Project Structure

```text
Learning-journal-PWA/
├── flask_app.py            # Main Flask application
├── templates/              # HTML pages
│   ├── index.html          # Home page
│   ├── journal.html        # Journal with Flask form
│   ├── projects.html       # Project portfolio
│   └── about.html          # About me page
├── static/
│   ├── manifest.json       # PWA Install Manifest
│   ├── css/
│   │   └── style.css       # All styling
│   ├── js/
│   │   ├── sw.js           # Service Worker (Offline Logic)
│   │   ├── script.js       # Navigation, Theme, PWA Register
│   │   ├── json-handler.js # Flask API communication
│   │   ├── storage.js      # localStorage functions
│   │   ├── browser.js      # Browser API features
│   │   └── thirdparty.js   # YouTube API integration
│   ├── images/             # Icons & Assets
│   └── backend/
│       └── reflections.json # Data storage (auto-created)

```
## 🎯 How to Use

1. **Visit the Site** Open the link in your browser.

2. **Install App** Look for the "Install" icon in your URL bar or select "Add to Home Screen" in your browser options.

3. **Write Entry** Go to the Journal page and save a reflection (this saves directly to the Flask backend).

4. **Go Offline** Turn off your internet—the app will still load, and you can read your saved entries!

5. **Export Data** Download your reflections as a JSON file for backup.


# 1. Clone the repository
git clone [https://github.com/rojinthapa/Learning-journal-PWA](https://github.com/rojinthapa/Learning-journal-PWA)

# 2. Install dependencies
pip install flask

# 3. Run the application
python flask_app.py

# 4. Open browser
http://localhost:5000
