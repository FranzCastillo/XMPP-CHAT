from flask import Flask, jsonify

app = Flask(__name__)


@app.route('/')
def home():
    return "Welcome to the Flask Backend!"


@app.route('/api/data', methods=['GET'])
def get_data():
    data = {"message": "Hello, World!"}
    return jsonify(data)


if __name__ == '__main__':
    app.run(debug=True)
