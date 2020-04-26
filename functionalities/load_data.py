from os.path import dirname

import networkx as nx
from igraph import *

from .facebook import load_facebook_data

BASE_PATH = dirname(dirname(os.path.abspath(__file__)))


def load_polblogs(filter_threshold=30):
    """Load political blog data

    Args:
        filter_threshold (int): threshold to control the size of graph

    Returns:
        graph_object (networkx object): loaded networkx object
        label_dict_set (dict): a dict of labels

    """
    path = os.path.join(BASE_PATH, "data", "polblogs.gml")
    graph = nx.read_gml(path)
    graph_igraph = read(filename=path, format="gml")
    graph = graph.to_directed()
    label_dict = {}
    for i, v in enumerate(graph.nodes()):
        if int(graph_igraph.vs["value"][i]) == 0:
            label_dict[v] = {"label": "Liberal", "value": 0}
        else:
            label_dict[v] = {"label": "Conserv", "value": 1}
    new_graph = nx.DiGraph()
    for u, v, data in graph.edges(data=True):
        if graph.degree(u) >= filter_threshold and graph.degree(
                v) >= filter_threshold:
            if new_graph.has_edge(u, v):
                new_graph[u][v]['weight'] = 1.0
            else:
                new_graph.add_edge(u, v, weight=1.0)
    label_dict_set = {
        "politicalStandpoint": label_dict
    }
    labels = ["Liberal", "Conservative"]
    return new_graph, label_dict_set, labels


def load_reddit(filter_threshold=15):
    """Load the reddit data

    Returns:
        G0 (networkx object): loaded networkx object
        label_dict_set (dict): a dict of labels

    """
    path = os.path.join(BASE_PATH, "data", "reddit.gml")
    graph = nx.read_gml(path)
    graph = graph.to_directed()
    # Gcc = sorted(nx.weakly_connected_component_subgraphs(graph),
    #                  key=len,
    #                  reverse=True)
    # G0 = graph.subgraph(Gcc[0])
    new_graph = nx.DiGraph()
    for u, v, data in graph.edges(data=True):
        if graph.degree(u) >= filter_threshold and graph.degree(
                v) >= filter_threshold:
            if new_graph.has_edge(u, v):
                new_graph[u][v]['weight'] = 1.0
            else:
                new_graph.add_edge(u, v, weight=1.0)
    label_dict = {}
    id = 0
    label_set = {}  # to test label id duplicate
    whiteSet = {"Sports", "Other", "General"}

    label_path = os.path.join(BASE_PATH, "data", "node_cat_map.txt")
    with open(label_path) as txt_file:
        for line in txt_file:
            key_value = line.strip().split(":")
            if key_value[1] not in whiteSet:
                continue
            if key_value[1] in label_set.keys():
                label_dict[key_value[0]] = {"label": key_value[1], "value": label_set[key_value[1]]}
            else:
                label_dict[key_value[0]] = {"label": key_value[1], "value": id}
                label_set[key_value[1]] = id
                id += 1

    label_dict_set = {
        "category": label_dict
    }
    labels = ["Other", "General", "Sports"]
    return new_graph, label_dict_set, labels


def load_facebook():
    graph, label_dict = load_facebook_data()
    # label_dict = {}
    # for i, v in enumerate(graph.nodes()):
    #     label_dict[v] = {"label": "User", "value": 0}
    # print(label_dict)
    label_dict_set = {
        "category": label_dict
    }
    return graph, label_dict_set, ["Gender1", "Gender2", "Gender3"]


def load_data_from_text(data_name="polblogs"):
    """Depend on data name to choose loading data function

    Args:
        data_name (string): name

    Returns:
        graph_object (networkx object): loaded networkx object
        label_dict_set (dict): a dict of labels
    """
    graph_object = None
    label_dict_set = {}
    labels = []
    if data_name == "polblogs":
        graph_object, label_dict_set, labels = load_polblogs()
    elif data_name == "reddit":
        graph_object, label_dict_set, labels = load_reddit()
    elif data_name == "facebook":
        graph_object, label_dict_set, labels = load_facebook()

    return graph_object, label_dict_set, labels
