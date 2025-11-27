# Learning Journal PWA

A Progressive Web App that documents my Mobile Application Development learning journey, built with Flask backend and modern web technologies.

## 🚀 Live Demo

**Live Site:** https://thaparojin.pythonanywhere.com

## 📖 About This Project

This is my learning journal and portfolio for the FGCT6021 Mobile Application Development unit. It started as a simple frontend project and evolved into a full-stack application with Flask backend.

### ✨ Features

- **📝 Journal Entries** - Weekly reflections on learning progress
- **🎨 Beautiful UI** - Responsive design with dark/light theme
- **🔗 Flask Backend** - Full-stack functionality with API routes
- **💾 Data Persistence** - Reflections saved to JSON file on server
- **📱 PWA Ready** - Works offline and can be installed as app
- **📤 Export Data** - Download reflections as JSON files

## 🛠️ Technology Stack

- **Frontend:** HTML5, CSS3, JavaScript
- **Backend:** Python, Flask
- **Deployment:** PythonAnywhere
- **Storage:** JSON file database
- **Features:** REST API, Responsive Design, PWA

## 📁 Project Structure
```

Learning-journal-PWA/
├──flask_app.py          # Main Flask application
├──templates/            # HTML pages
│├── index.html        # Home page
│├── journal.html      # Journal with Flask form
│├── projects.html     # Project portfolio
│└── about.html        # About me page
├──static/
│├── css/style.css     # All styling
│├── js/
││   ├── script.js     # Navigation & theme
││   ├── storage.js    # localStorage functions
││   └── json-handler.js # Flask API communication
│└── images/           # Profile & assets
└──reflections.json      # Data storage (auto-created)

```

## 🎯 How to Use

1. **Visit the Journal page**
2. **Fill out the form** with your name and reflection
3. **Click "Save Entry"** - it will save to Flask backend
4. **View all reflections** dynamically loaded from server
5. **Export data** using the "Export JSON" button

## 🔧 Development

### Local Setup (if you want to run it):

```bash
# 1. Clone the repository
git clone https://github.com/rojinthapa/Learning-journal-PWA

# 2. Install dependencies
pip install flask

# 3. Run the application
python flask_app.py

# 4. Open browser
http://localhost:5000
```
