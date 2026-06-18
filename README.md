# Smart Student Placement Tracker

A full-stack web application that tracks student placement readiness, predicts placement chances using machine learning, and recommends suitable companies.

## Features
- Student Login and Registration with JWT Authentication
- Student Profile Management (CGPA, scores, skills)
- Resume Upload and Management
- Aptitude and Coding Score Tracking
- Project and Internship Tracking
- Placement Eligibility Checker
- Company Management (Admin)
- ML-based Placement Prediction using Random Forest
- Company Recommendation System
- Admin Dashboard with Analytics and Charts

## Tech Stack
- Frontend: React 18, Vite, Tailwind CSS
- Backend: Node.js, Express.js
- Database: MongoDB Atlas
- ML Service: Python, Flask, scikit-learn
- Authentication: JWT, bcryptjs

## How to Run

### Backend
cd server
npm install
npm run dev

### Frontend
cd client
npm install
npm run dev

### ML Service
cd ml
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python train.py
python app.py

## Author
Saripudi Jayalakshmi