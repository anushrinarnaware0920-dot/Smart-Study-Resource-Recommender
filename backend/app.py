# =========================================
# SmartStudy - Flask Backend
# =========================================

from flask import Flask, request, jsonify
from flask_cors import CORS

from recommender import recommend_resources

import json
import os


app = Flask(__name__)

CORS(app)


# =========================================
# Load Resources
# =========================================

def load_resources():

    base_dir = os.path.dirname(
        os.path.dirname(
            os.path.abspath(__file__)
        )
    )

    file_path = os.path.join(
        base_dir,
        "data",
        "resources.json"
    )

    with open(
        file_path,
        "r",
        encoding="utf-8"
    ) as file:

        return json.load(file)


resources = load_resources()


# =========================================
# Home Route
# =========================================

@app.route("/")
def home():

    return jsonify({
        "message": "SmartStudy API is running!",
        "status": "success"
    })


# =========================================
# Recommendation API
# =========================================

@app.route("/recommend", methods=["POST"])
def recommend():

    data = request.get_json()

    subject = data.get("subject")
    topic = data.get("topic")
    level = data.get("level")
    resource_type = data.get("resourceType")


    # Validate input
    if not subject or not topic or not level:

        return jsonify({
            "success": False,
            "message": "Subject, topic and level are required."
        }), 400


    # Generate recommendations
    results = recommend_resources(
        resources,
        subject,
        topic,
        level,
        resource_type
    )


    return jsonify({
        "success": True,
        "count": len(results),
        "recommendations": results
    })


# =========================================
# Run Application
# =========================================

if __name__ == "__main__":

    app.run(
        debug=True,
        port=5000
    )