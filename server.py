from flask import Flask, escape, request, json, jsonify

app = Flask(__name__)


@app.route('/')
def hello():
    name = request.args.get("name", "World")
    return f'Hello, {escape(name)}!'


@app.route('/perturb/', methods=['POST'])
def perturb():
    """Given ID load perturbation data

    Returns: meta data in json

    """
    request_raw = request.get_json()
    res = {}
    print("perturbing...")
    with open("cached_data/" + request_raw["dataName"] + "_" + request_raw[
                "algorithmName"] + "_detail_" + str(request_raw["removeID"]) +".json") as json_file:
        res = json.load(json_file)
    print("perturbation executed")
    return jsonify(res)


@app.route('/loadData/', methods=['POST'])
def load_data():
    """Load data offline mode

    Returns: meta data in json

    """
    request_raw = request.get_json()
    res = {}
    print("load data")
    with open("cached_data/" + request_raw["dataName"] + "_" + request_raw[
                "algorithmName"] + "_overview.json") as json_file:
        res = json.load(json_file)
    print("data loaded")
    return jsonify(res)

# @app.route('/loadData/', methods=['POST'])
# def load_data():
#     """Load data online mode
#
#     Returns: meta data in json
#
#     """
#     request_raw = request.get_json()
#     graph_object, label_dict_set = load_data_from_text(
#         data_name=request_raw["dataName"])
#     meta_data = MetaData(graph_object=graph_object,
#                          label_dict_set=label_dict_set,
#                          algorithm_name=request_raw["algorithmName"])
#     return json.dumps(meta_data, cls=MetaDataEncoder)

if __name__ == "__main__":
    app.run(debug=True) 