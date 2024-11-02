import os
import json
import google.generativeai as genai
from flask import Flask, render_template, request, jsonify, send_file
import markdown

app = Flask(__name__)

# Configure API key
api = os.getenv("MAKERSUITE_API_TOKEN") 
genai.configure(api_key=api)

# Initialize the GenAI model once
model = genai.GenerativeModel(model_name='gemini-1.5-flash-8b')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate_financial_plan', methods=['POST'])
def generate_financial_plan():
    if request.method == 'POST':
        try:
            # Ensure required fields are present
            user_goal = request.form.get('goal')
            time_horizon = request.form.get('time_horizon')
            risk_appetite = request.form.get('risk_appetite')

            if not all([user_goal, time_horizon, risk_appetite]):
                return jsonify({'error': 'Missing required fields in the form.'}), 400

            prompt = (
                f"Create a personalized financial plan for a goal: '{user_goal}' with a time horizon of {time_horizon} years "
                f"and a risk appetite of {risk_appetite}%, which ranges from 0% to 100%. "
                f"Keep it concise but precise and easy to understand. Minimize bullet points."
            )
            
            response = model.generate_content(prompt).text
            markdown_response = markdown.markdown(response)
            
            return jsonify({'financial_plan': markdown_response})
        
        except Exception as e:
            return jsonify({'error': 'Failed to generate financial plan', 'details': str(e)}), 500

@app.route('/generate_savings_strategy', methods=['POST'])
def generate_savings_strategy():
    if request.method == 'POST':
        try:
            spending_habits = str(request.form.get('spending_habits', ''))
            if not spending_habits:
                return jsonify({'error': 'No spending habits provided'}), 400

            prompt = f"""Create a personalized savings strategy. Keep it concise but precise and easy to understand.
                        These are the current spending habits of the user: {spending_habits}. Include the following:
                        1. How much to save monthly 2. Where to save 3. How to save. 4. How to track progress.
                        5. How to adjust the strategy. 6. Long-term lifestyle changes.
                    """
            
            model = genai.GenerativeModel(model_name='gemini-1.5-flash-8b')
            response = model.generate_content(prompt).text
            markdown_response = markdown.markdown(response)
            
            return jsonify({'savings_strategy': markdown_response})
        
        except Exception as e:
            return jsonify({'error': 'Failed to generate savings strategy', 'details': str(e)}), 500
        
# List of predefined character images
character_images = [
    "static/assets/char1.png",
    "static/assets/char2.png",
    "static/assets/char3.png"
]

# Index to keep track of the current image
current_image_index = 0

@app.route('/generate-character', methods=['GET'])

def generate_character():
    global current_image_index
    chosen_image = character_images[current_image_index]
    current_image_index = (current_image_index + 1) % len(character_images)
    return send_file(chosen_image, mimetype='image/png')

if __name__ == '__main__':
    app.run(host="0.0.0.0", port="3415", debug=True)
