from flask import Flask, jsonify
from fetch_from_db import fetch_items

from bson import json_util, ObjectId
from flask.json import JSONEncoder

class CustomJSONEncoder(JSONEncoder):
    def default(self, obj): return json_util.default(obj)

app = Flask(__name__)
app.json_encoder = CustomJSONEncoder

# Define routes

# Homepage
@app.route("/")

# All items
@app.route('/api/items')
def get_items():
    items = fetch_items()
    return jsonify(items)



if __name__ == '__main__':
    app.run(debug=True)


