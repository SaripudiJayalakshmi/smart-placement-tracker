from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os

app = Flask(__name__)
CORS(app)

MODEL_PATH = 'model/placement_model.pkl'
FEATURES_PATH = 'model/feature_names.pkl'

model = None
feature_names = None

def load_model():
    global model, feature_names
    if os.path.exists(MODEL_PATH):
        model = joblib.load(MODEL_PATH)
        feature_names = joblib.load(FEATURES_PATH)
        print("Model loaded successfully")
    else:
        print("Model not found. Run train.py first.")

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        'success': True,
        'message': 'Smart Placement ML API is running',
        'model_loaded': model is not None
    })

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'success': False, 'message': 'Model not loaded'}), 500

    try:
        data = request.get_json()

        cgpa = float(data.get('cgpa', 0))
        aptitude_score = float(data.get('aptitudeScore', 0))
        coding_score = float(data.get('codingScore', 0))
        projects_count = int(data.get('projectsCount', 0))
        internships_count = int(data.get('internshipsCount', 0))
        skills_count = int(data.get('skillsCount', 0))
        backlogs = int(data.get('backlogs', 0))

        features = [[
            cgpa,
            aptitude_score,
            coding_score,
            projects_count,
            internships_count,
            skills_count,
            backlogs
        ]]

        probability = model.predict_proba(features)[0][1]
        prediction = model.predict(features)[0]

        percentage = round(probability * 100, 1)

        if percentage >= 75:
            level = 'High'
            message = 'Excellent! You have a strong chance of placement.'
            color = 'green'
        elif percentage >= 50:
            level = 'Medium'
            message = 'Good profile! Focus on improving weak areas.'
            color = 'yellow'
        elif percentage >= 25:
            level = 'Low'
            message = 'Keep working on your skills and scores.'
            color = 'orange'
        else:
            level = 'Very Low'
            message = 'Significant improvement needed. Focus on CGPA and coding skills.'
            color = 'red'

        return jsonify({
            'success': True,
            'prediction': {
                'probability': percentage,
                'placed': bool(prediction),
                'level': level,
                'message': message,
                'color': color,
                'breakdown': {
                    'cgpa': cgpa,
                    'aptitudeScore': aptitude_score,
                    'codingScore': coding_score,
                    'projectsCount': projects_count,
                    'internshipsCount': internships_count,
                    'skillsCount': skills_count,
                    'backlogs': backlogs
                }
            }
        })

    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 400

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'model_loaded': model is not None})
@app.route('/recommend', methods=['POST'])
def recommend():
    try:
        data = request.get_json()
        
        student_skills = [s.lower() for s in data.get('skills', [])]
        cgpa = float(data.get('cgpa', 0))
        aptitude = float(data.get('aptitudeScore', 0))
        coding = float(data.get('codingScore', 0))
        companies = data.get('companies', [])
        
        recommendations = []
        
        for company in companies:
            required_skills = [s.lower() for s in company.get('requiredSkills', [])]
            min_cgpa = float(company.get('minCGPA', 0))
            min_aptitude = float(company.get('minAptitudeScore', 0))
            min_coding = float(company.get('minCodingScore', 0))
            
            if required_skills:
                matched = [s for s in required_skills if s in student_skills]
                skill_score = len(matched) / len(required_skills) * 40
            else:
                matched = []
                skill_score = 40
            
            cgpa_score = min(cgpa / max(min_cgpa, 1), 1) * 25 if min_cgpa > 0 else 25
            apt_score = min(aptitude / max(min_aptitude, 1), 1) * 20 if min_aptitude > 0 else 20
            code_score = min(coding / max(min_coding, 1), 1) * 15 if min_coding > 0 else 15
            
            total = round(min(skill_score + cgpa_score + apt_score + code_score, 100), 1)
            
            eligible = (
                cgpa >= min_cgpa and
                aptitude >= min_aptitude and
                coding >= min_coding and
                len(matched) == len(required_skills)
            )
            
            recommendations.append({
                'companyId': company.get('_id'),
                'name': company.get('name'),
                'sector': company.get('sector'),
                'package': company.get('package'),
                'location': company.get('location'),
                'matchScore': total,
                'eligible': eligible,
                'matchedSkills': matched,
                'missingSkills': [s for s in required_skills if s not in student_skills],
            })
        
        recommendations.sort(key=lambda x: x['matchScore'], reverse=True)
        
        return jsonify({'success': True, 'recommendations': recommendations})
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 400
if __name__ == '__main__':
    load_model()
    import os
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=False)
    