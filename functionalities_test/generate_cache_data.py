import json

from functionalities.load_data import load_data_from_text
from metadata import MetaData, MetaDataEncoder


def generate_cache_data(data_name, algorithm_name):
    graph_object, label_dict_set = load_data_from_text(data_name=data_name)
    meta_data = MetaData(graph_object=graph_object,
                         label_dict_set=label_dict_set,
                         algorithm_name=algorithm_name)
    with open(
            "../cached_data/" + data_name + "_" + algorithm_name + "_filthre_30.json",
            "w") as jf:
        json.dump(meta_data, jf, cls=MetaDataEncoder)
    print("data cached")


if __name__ == "__main__":
    generate_cache_data(data_name="polblogs", algorithm_name="pagerank")
