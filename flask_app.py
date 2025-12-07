from flask import Flask, render_template, request, jsonify, send_from_directory, make_response
import json, os
from datetime import datetime

app = Flask(__name__)

# Base directory setup
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, "static", "backend", "reflections.json")

# --- Utility functions ---
def load_reflections():
    try:
        if os.path.exists(DATA_FILE):
            with open(DATA_FILE, "r") as f:
                return json.load(f)
        return []
    except Exception as e:
        print(f"Error loading reflections: {e}")
        return []

def save_reflections(reflections):
    try:
        os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
        with open(DATA_FILE, "w") as f:
            json.dump(reflections, f, indent=4)
        print(f"Successfully saved {len(reflections)} reflections")
    except Exception as e:
        print(f"Error saving reflections: {e}")

# --- PWA SPECIFIC ROUTES (LAB 7) ---

@app.route('/manifest.json')
def manifest():
    # Serves the manifest from the static folder
    return send_from_directory('static', 'manifest.json')

@app.route('/sw.js')
def service_worker():
    # SERVES SW.JS FROM static/js/ BUT AS A ROOT URL
    # This is critical for the Service Worker scope to include the whole app
    response = make_response(send_from_directory('static/js', 'sw.js'))
    # Ensure browsers allow it to control the root scope
    response.headers['Service-Worker-Allowed'] = '/'
    return response

# --- STANDARD PAGE ROUTES ---

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/journal")
def journal():
    return render_template("journal.html")

@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/projects")
def projects():
    return render_template("projects.html")

# --- API ROUTES ---

@app.route("/api/reflections", methods=["GET"])
def get_reflections():
    reflections = load_reflections()
    return jsonify(reflections)

@app.route("/api/reflections", methods=["POST"])
def add_reflection():
    try:
        data = request.get_json()
        reflection_text = data.get("reflection") or data.get("text", "")

        new_reflection = {
            "name": data.get("name", "Anonymous"),
            "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "reflection": reflection_text,
            "text": reflection_text
        }

        reflections = load_reflections()
        reflections.append(new_reflection)
        save_reflections(reflections)

        return jsonify(new_reflection), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/reflections/<int:index>", methods=["DELETE"])
def delete_reflection(index):
    try:
        reflections = load_reflections()
        if 0 <= index < len(reflections):
            deleted = reflections.pop(index)
            save_reflections(reflections)
            return jsonify({"deleted": deleted}), 200
        return jsonify({"error": "Invalid index"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
    
