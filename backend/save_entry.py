import json
import datetime
import os

def save_reflection():
    # Get user input
    reflection_text = input("Enter your reflection: ")
    
    # Create reflection object WITHOUT ID
    reflection = {
        "date": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "text": reflection_text
        # REMOVED: "id": datetime.datetime.now().timestamp()
    }
    
    # Read existing reflections
    try:
        with open('reflections.json', 'r', encoding='utf-8') as f:
            reflections = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        reflections = []
    
    # Add new reflection
    reflections.append(reflection)
    
    # Save back to file
    with open('reflections.json', 'w', encoding='utf-8') as f:
        json.dump(reflections, f, indent=2)
    
    print(f" Reflection saved! Total reflections: {len(reflections)}")

if __name__ == "__main__":
    save_reflection()