from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

STABILITY_API_KEY = "sk-eNIrz6a2flF2XdAVECmWhckztUeB4ZBPPxc4NzNhjMQfP9ny"  # Replace with your actual Stability AI key
@app.route('/generate-image', methods=['POST'])
def generate_image():
    data = request.get_json()
    prompt = data.get('prompt')

    if not prompt:
        return jsonify({'error': 'Prompt is required'}), 400

    url = "https://api.stability.ai/v2beta/stable-image/generate/sd3"
    headers = {
        "authorization": f"Bearer {STABILITY_API_KEY}",
        "accept": "application/json"
    }

    payload = {
        "prompt": prompt,
        "output_format": "jpeg",
        "model": "sd3.5-large",
        "aspect_ratio": "1:1"
    }

    # Required dummy file field to comply with multipart/form-data
    files = {"none": ''}

    try:
        response = requests.post(url, headers=headers, data=payload, files=files)

        if response.status_code == 200:
            result = response.json()
            image_base64 = result.get("image")
            return jsonify({'imageData': image_base64})
        else:
            return jsonify({'error': response.json()}), response.status_code
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
