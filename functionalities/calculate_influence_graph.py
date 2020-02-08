import copy


def calculate_influence_graph(graph, remove_res, remove_id, level_threshold=5):
    filtered_change_res = {}
    nodes_res = []
    edges_res = []
    nodes_res.append({"node_id": remove_id, "level": 0})
    for remove_res_item in remove_res:
        if remove_res_item["rank_change"] != 0:
            filtered_change_res[remove_res_item["node_id"]] = remove_res_item

    nodes_to_iterate = [remove_id]
    for i in range(1, level_threshold + 1):
        nodes_to_iterate_copy = copy.copy(nodes_to_iterate)
        for node in nodes_to_iterate:
            for neighbor in graph.neighbors(node):
                if neighbor in filtered_change_res:
                    nodes_res.append({"node_id": neighbor, "level": i})
                    edges_res.append({"source": remove_id, "target": neighbor,
                                      "source_id": remove_id,
                                      "target_id": neighbor,
                                      "influence": filtered_change_res[neighbor]["rank_change"]})
                    del filtered_change_res[neighbor]
                    nodes_to_iterate_copy.append(neighbor)
        nodes_to_iterate = nodes_to_iterate_copy

    print(nodes_res)
    print(edges_res)
    return nodes_res, edges_res
