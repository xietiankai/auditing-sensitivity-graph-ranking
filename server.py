from flask import Flask, escape, request, json

from functionalities.load_data import load_data_from_text
from metadata import MetaData, MetaDataEncoder

app = Flask(__name__)


@app.route('/')
def hello():
    name = request.args.get("name", "World")
    return f'Hello, {escape(name)}!'


@app.route('/loadData/', methods=['POST'])
def load_data():
    request_raw = request.get_json()
    graph_object, label_dict_set = load_data_from_text(
        data_name=request_raw["dataName"])
    meta_data = MetaData(graph_object=graph_object,
                         label_dict_set=label_dict_set,
                         algorithm_name=request_raw["algorithmName"])
    return json.dumps(meta_data, cls=MetaDataEncoder)
