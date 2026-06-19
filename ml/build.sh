#!/bin/bash
pip install --upgrade pip
pip install --only-binary=:all: scikit-learn==1.2.2 numpy==1.24.3 pandas==1.5.3
pip install flask==2.3.3 flask-cors==4.0.0 joblib==1.3.2 Werkzeug==2.3.7
python train.py