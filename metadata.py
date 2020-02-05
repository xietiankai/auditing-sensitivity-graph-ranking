import json
from uuid import UUID

import numpy

from functionalities.calculate_auditing_res import ranking_data_formation
from functionalities.inverse_mapping import inverse_mapping
from functionalities.perturbation_enumeration import perturbation_preview
from functionalities.perturbation_enumeration_statistics import \
    perturbation_enumeration_statistics
from functionalities.summarize_perturbation_effect import \
    summarize_perturbation_effect


class MetaDataEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, numpy.integer):
            return int(obj)
        elif isinstance(obj, numpy.floating):
            return float(obj)
        elif isinstance(obj, numpy.ndarray):
            return obj.tolist()
        if isinstance(obj, UUID):
            # if the obj is uuid, we simply return the value of uuid
            return obj.hex
        else:
            return obj.__dict__


class MetaData:
    def __init__(self, graph_object, label_dict_set, algorithm_name):
        """Form the meta data.

        Args:
            graph_object (networkx object): networkx object
            label_dict_set (dict): a dict of label dicts
            algorithm_name (string): ranking algorithm names "pagerank" | "hits"
        """
        self.nodes, self.edges = ranking_data_formation(graph=graph_object,
                                                        algorithm=algorithm_name)
        perturbations = perturbation_preview(graph=graph_object.copy(),
                                             original_node_info=self.nodes,
                                             label_dict_set=label_dict_set,
                                             algorithm=algorithm_name)
        self.perturbations = perturbation_enumeration_statistics(perturbations)
        self.vulnerabilityList = inverse_mapping(perturbations)
        self.perturbationSummary = summarize_perturbation_effect(perturbations)
        self.labels = label_dict_set
