from flask import Flask, render_template, request, jsonify
import json, os
from datetime import datetime

app = Flask(__name__)

# Keep your existing file path - reflections.json in static/backend/
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
        # Create directory if it doesn't exist
        os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
        with open(DATA_FILE, "w") as f:
            json.dump(reflections, f, indent=4)
        print(f"Successfully saved {len(reflections)} reflections to {DATA_FILE}")
    except Exception as e:
        print(f"Error saving reflections: {e}")

# --- Routes for HTML pages ---
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

# --- API routes for reflections ---
@app.route("/api/reflections", methods=["GET"])
def get_reflections():
    reflections = load_reflections()
    print(f"Returning {len(reflections)} reflections")  # Debug
    return jsonify(reflections)

@app.route("/api/reflections", methods=["POST"])
def add_reflection():
    try:
        data = request.get_json()
        print(f"📨 Received POST data: {data}")  # Debug log

        # Handle both 'reflection' and 'text' fields for compatibility
        reflection_text = data.get("reflection") or data.get("text", "")

        new_reflection = {
            "name": data.get("name", "Anonymous"),
            "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "reflection": reflection_text,
            "text": reflection_text  # Include both for compatibility
        }

        reflections = load_reflections()
        reflections.append(new_reflection)
        save_reflections(reflections)

        print(f"✅ Saved new reflection: {new_reflection}")  # Debug log
        return jsonify(new_reflection), 201

    except Exception as e:
        print(f"❌ Error in add_reflection: {e}")
        return jsonify({"error": str(e)}), 500

# --- Extra feature: Delete reflection ---
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
        print(f"Error deleting reflection: {e}")
        return jsonify({"error": str(e)}), 500

# --- Extra feature: Edit reflection ---
@app.route("/api/reflections/<int:index>", methods=["PUT"])
def edit_reflection(index):
    try:
        reflections = load_reflections()
        if 0 <= index < len(reflections):
            data = request.get_json()
            reflection_text = data.get("reflection") or data.get("text", "")

            reflections[index]["reflection"] = reflection_text
            reflections[index]["text"] = reflection_text  # Update both
            reflections[index]["date"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

            save_reflections(reflections)
            return jsonify(reflections[index]), 200
        return jsonify({"error": "Invalid index"}), 404
    except Exception as e:
        print(f"Error editing reflection: {e}")
        return jsonify({"error": str(e)}), 500

# --- Debug route to check file status ---
@app.route("/api/debug")
def debug():
    return jsonify({
        "data_file_path": DATA_FILE,
        "file_exists": os.path.exists(DATA_FILE),
        "file_directory_exists": os.path.exists(os.path.dirname(DATA_FILE)),
        "current_reflections_count": len(load_reflections()),
        "current_reflections": load_reflections()
    })

if __name__ == "__main__":
    app.run(debug=True)