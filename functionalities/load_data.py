import networkx as nx
from igraph import *
from os.path import dirname

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
    return new_graph, label_dict_set


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
    if data_name == "polblogs":
        graph_object, label_dict_set = load_polblogs()
    return graph_object, label_dict_set
