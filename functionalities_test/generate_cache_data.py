
import os
import sys
from os.path import dirname, abspath
sys.path.append(dirname(dirname(abspath(__file__))))

from metadata import MetaData, MetaDataEncoder
from functionalities.load_data import load_data_from_text
import json



def generate_cache_data(data_name, algorithm_name):
    print(f'Preprocessing the data {data_name} - {algorithm_name}...')
    print("graph data loading... [0/6]")
    graph_object, label_dict_set, labels = load_data_from_text(
        data_name=data_name)
    print("done.")
    print("The node size " + str(len(graph_object.nodes)))
    print("The edge size " + str(len(graph_object.edges)))
    meta_data = MetaData(graph_object=graph_object,
                         label_dict_set=label_dict_set,
                         algorithm_name=algorithm_name,
                         labels=labels)

    ###################################################################
    # overview data file format
    ###################################################################
    overview_data = []
    print("data caching... [6/6]")
    for perturbation in meta_data.perturbations:
        overview_data_item = {
            "remove_id": perturbation["remove_id"],
            "vul_percentile": perturbation["vul_percentile"],
            "rank": perturbation["rank"],
            "node_influence": perturbation["node_influence"],
            "label": perturbation["label"],
            "label_influence": perturbation["label_influence"]
        }
        overview_data.append(overview_data_item)
        with open(
            "../cached_data/" + data_name + "_" + algorithm_name + "_detail_" + str(perturbation["remove_id"]) + ".json",
            "w") as jf:
            json.dump(perturbation, jf, cls=MetaDataEncoder)

    with open(
            "../cached_data/" + data_name + "_" + algorithm_name + "_overview.json",
            "w") as jf:
        json.dump({"perturbations": overview_data,
                   "nodes": meta_data.nodes,
                   "labels": meta_data.labels,
                   "labelNames": meta_data.labelNames,
                   "vulnerabilityList": meta_data.vulnerabilityList,
                   "perturbationSummary": meta_data.perturbationSummary}, jf, cls=MetaDataEncoder)

    print("data cached.")

    # with open(
    #         "../cached_data/" + data_name + "_" + algorithm_name + "_filthre_30.json",
    #         "w") as jf:
    #     json.dump(meta_data, jf, cls=MetaDataEncoder)
    # print("data cached")


if __name__ == "__main__":
    generate_cache_data(data_name="reddit", algorithm_name="pagerank")
