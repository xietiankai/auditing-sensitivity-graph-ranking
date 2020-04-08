import json
import os
import sys
from os.path import dirname, abspath

sys.path.append(dirname(dirname(abspath(__file__))))

from metadata import MetaData, MetaDataEncoder
from functionalities.load_data import load_data_from_text


def generate_cache_data(data_name, algorithm_name):
    graph_object, label_dict_set, labels = load_data_from_text(data_name=data_name)
    print("Graph loaded")
    print("The node size " + str(len(graph_object.nodes)))
    print("The edge size " + str(len(graph_object.edges)))
    meta_data = MetaData(graph_object=graph_object,
                         label_dict_set=label_dict_set,
                         algorithm_name=algorithm_name,
                         labels=labels)
    print("The node size " + str(len(graph_object.nodes)))
    print("The edge size " + str(len(graph_object.edges)))
    with open(
            "../cached_data/" + data_name + "_" + algorithm_name + "_filthre_30.json",
            "w") as jf:
        json.dump(meta_data, jf, cls=MetaDataEncoder)
    print("data cached")


if __name__ == "__main__":
    generate_cache_data(data_name="facebook", algorithm_name="pagerank")
