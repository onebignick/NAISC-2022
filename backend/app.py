from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/data')
def index():
    response_body = {'data' : [-8, -9, -10, '48jhgkjl']}
    return response_body

if __name__ == '__main__':
    app.run(debug=True)