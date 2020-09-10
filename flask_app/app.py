from flask import Flask, jsonify
from fetch_from_db import fetch_states, fetch_national

from bson import json_util, ObjectId
from flask.json import JSONEncoder

class CustomJSONEncoder(JSONEncoder):
    def default(self, obj): return json_util.default(obj)

app = Flask(__name__)
app.json_encoder = CustomJSONEncoder

# Define routes

# Homepage
@app.route("/")
def home():
    return(
        f"<h1 align=center>Welcome to 2020 Presidential Election API</h1><br/>"
        f"<u>List of available routes </u> - <i>access data using paths below:</i><br/>"
        f"Information by State:  /api/states<br/>"
        f"Information by Date:   /api/national<br/>"
    )

# All items
@app.route('/api/states')
def get_items():
    states = fetch_states()
    return jsonify(states)

@app.route('/api/national')
def get_national():
    national = fetch_national()
    return jsonify(national)


if __name__ == '__main__':
    app.run(debug=True)


