from flask import render_template
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
def welcome():
    return render_template("index.html")

@app.route("/comparisons")
def comparisons():
    return render_template("comparisons.html")

@app.route("/timeline")
def comparisons():
    return render_template("timeline.html")

@app.route("/votepower")
def comparisons():
    return render_template("votepower.html")

# API Homepage
@app.route('/api/v1.0')
def apis():
    return(
        f'<h1 align=center>2020 Presidential Election API</h1><br/>'
        f'<b>List of available routes </b> - <i>access data using paths below:</i><br/>'
        f'<a href="/api/v1.0/states">Information by State:  /api/states</a><br/>'
        f'<a href="/api/v1.0/national">Information by Date:   /api/national</a><br/>'
    )

# All items
@app.route('/api/v1.0/states')
def get_items():
    states = fetch_states()
    return jsonify(states)

@app.route('/api/v1.0/national')
def get_national():
    national = fetch_national()
    return jsonify(national)


if __name__ == '__main__':
    app.run(debug=True)


