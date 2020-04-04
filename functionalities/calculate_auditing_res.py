import networkx as nx


def sort_by_rank(val):
    """
    Sorter by rank value
    :param val: node
    :return: nodes' rank value
    """
    return float(val["rank_value"])


def generate_edges(graph):
    edges = []
    for edge in graph.edges():
        edges.append(
            {"source": edge[0], "target": edge[1], "source_id": edge[0],
             "target_id": edge[1]})
    return edges


def ranking_data_formation(graph, algorithm):
    """Formulate graph ranking of nodes, and edges for drawing

    Args:
        graph (networkx): graph object
        algorithm (string): "pagerank" or "hits"

    Returns:
        data structure
        result = {
            nodes = {
                node_id,
                rank_value,
                node_degree,
                rank
            },
            edges = {
                source,
                target,
                source_id,
                target_id
            }
        }

    """
    res_nodes = {}
    if algorithm == "pagerank":
        r = nx.pagerank(graph)
        temp_res_nodes = []
        for node in graph.nodes():
            node_meta = {
                "node_id": node,
                "rank_value": r[node],
                "node_degree": graph.degree(node),
                "predecessors": list(graph.predecessors(node)),
                "successors": list(graph.successors(node))
            }

            temp_res_nodes.append(node_meta)
        temp_res_nodes.sort(key=sort_by_rank, reverse=True)
        for index, node in enumerate(temp_res_nodes):
            node["rank"] = index + 1
            res_nodes[node["node_id"]] = node

    elif algorithm == "hits":
        r = nx.hits(graph)
        temp_res_nodes = []
        for node in graph:
            node_meta = {
                "node_id": node,
                "rank_value": r[1][node],
                "node_degree": graph.degree(node),
                "predecessors": list(graph.predecessors(node)),
                "successors": list(graph.successors(node))
            }
            temp_res_nodes.append(node_meta)
        temp_res_nodes.sort(key=sort_by_rank, reverse=True)
        for index, node in enumerate(temp_res_nodes):
            node["rank"] = index + 1
            res_nodes[node["node_id"]] = node

    return res_nodes, generate_edges(graph)
