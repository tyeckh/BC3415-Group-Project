import os
import json
import google.generativeai as genai
from flask import Flask, render_template, request, jsonify
import markdown

app = Flask(__name__)
API_KEY = "AIzaSyAq7-KBx4OHHOUL_Q10es6EIEsZnsW8mOM"
genai.configure(api_key=API_KEY)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate_financial_plan', methods=['POST'])
def generate_financial_plan():
    if request.method == 'POST':
        user_goal = str(request.form['goal'])
        time_horizon = str(request.form['time_horizon'])
        risk_appetite = str(request.form['risk_appetite'])
        prompt = f"Create a personalized financial plan for a goal: '{user_goal}' with a time horizon of {time_horizon} years and a risk appetite of {risk_appetite}%. Keep it concise and easy to understand."
        model = genai.GenerativeModel(model_name='gemini-1.5-flash-8b')
        response = model.generate_content(prompt).text
        markdown_response = markdown.markdown(response)
        return render_template('index.html', financial_plan=markdown_response)
    return render_template('index.html')

if __name__ == '__main__':
    app.run(host="0.0.0.0", port="3415", debug=True)

