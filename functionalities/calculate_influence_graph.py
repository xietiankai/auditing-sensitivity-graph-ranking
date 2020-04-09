import queue


##################################################################################
# Version 1
##################################################################################

# def calculate_influence_graph(graph, remove_res, remove_id, level_threshold=10):
#     filtered_change_res = {}
#     nodes_res = []
#     edges_res = []
#     nodes_res.append({"node_id": remove_id, "level": 0})
#     for remove_res_item in remove_res:
#         if remove_res_item["rank_change"] != 0:
#             filtered_change_res[remove_res_item["node_id"]] = remove_res_item
#
#     nodes_to_iterate = [remove_id]
#     for i in range(1, level_threshold + 1):
#         nodes_to_iterate_copy = copy.copy(nodes_to_iterate)
#         for node in nodes_to_iterate:
#             for neighbor in graph.neighbors(node):
#                 if neighbor in filtered_change_res:
#                     nodes_res.append({"node_id": neighbor, "level": i,
#                                       "rank_change":
#                                           filtered_change_res[neighbor][
#                                               "rank_change"]})
#                     edges_res.append({"source": remove_id, "target": neighbor,
#                                       "source_id": remove_id,
#                                       "target_id": neighbor,
#                                       "influence":
#                                           filtered_change_res[neighbor][
#                                               "rank_change"]})
#                     del filtered_change_res[neighbor]
#                     nodes_to_iterate_copy.append(neighbor)
#         nodes_to_iterate = nodes_to_iterate_copy
#
#     return nodes_res, edges_res

##################################################################################
# Version 2
##################################################################################

# def calculate_influence_graph(graph, remove_res, remove_id, level_threshold=10):
#     filtered_change_res = {}
#     nodes_res = []
#     edges_res = []
#     nodes_res.append({"node_id": remove_id, "level": 0})
#     for remove_res_item in remove_res:
#         if remove_res_item["rank_change"] != 0:
#             filtered_change_res[remove_res_item["node_id"]] = remove_res_item
#
#     nodes_to_iterate = [remove_id]
#     for i in range(1, level_threshold + 1):
#         nodes_to_iterate_copy = copy.copy(nodes_to_iterate)
#         filtered_queue = set()
#         for node in nodes_to_iterate:
#             for neighbor in graph.neighbors(node):
#                 if neighbor in filtered_change_res:
#                     if neighbor not in filtered_queue:
#                         nodes_res.append({"node_id": neighbor, "level": i,
#                                       "rank_change":
#                                           filtered_change_res[neighbor][
#                                               "rank_change"]})
#                     edges_res.append({"source": node, "target": neighbor,
#                                       "source_id": node,
#                                       "target_id": neighbor,
#                                       "influence":
#                                           filtered_change_res[neighbor][
#                                               "rank_change"]})
#                     filtered_queue.add(neighbor)
#
#         for item in list(filtered_queue):
#             del filtered_change_res[item]
#             nodes_to_iterate_copy.append(item)
#         nodes_to_iterate = nodes_to_iterate_copy
#
#     return nodes_res, edges_res

##################################################################################
# Version 3
##################################################################################

#
# def calculate_influence_graph(graph, remove_res, remove_id, level_threshold=10):
#     filtered_change_res = {}
#     nodes_res = []
#     edges_res = []
#     nodes_res.append({"node_id": remove_id, "level": 0})
#     for remove_res_item in remove_res:
#         if remove_res_item["rank_change"] != 0:
#             filtered_change_res[remove_res_item["node_id"]] = remove_res_item
#
#     nodes_to_iterate = [remove_id]
#     for i in range(1, level_threshold + 1):
#         nodes_to_iterate_copy = copy.copy(nodes_to_iterate)
#         filtered_queue = {}
#         for node in nodes_to_iterate:
#             for neighbor in graph.neighbors(node):
#                 if neighbor in filtered_change_res:
#                     node_name = neighbor
#                     new_index = 1
#                     if neighbor in filtered_queue.keys():
#                         new_index = filtered_queue[neighbor] + 1
#                         node_name = neighbor + "@" + str(new_index)
#                     nodes_res.append({"node_id": node_name, "level": i, "rank_change":
#                                           filtered_change_res[neighbor]["rank_change"]})
#                     edges_res.append({"source": node, "target": node_name,
#                                       "source_id": node,
#                                       "target_id": node_name,
#                                       "influence": filtered_change_res[neighbor][
#                                               "rank_change"]})
#                     filtered_queue[neighbor] = new_index
#
#         for item in list(filtered_queue):
#             del filtered_change_res[item]
#             nodes_to_iterate_copy.append(item)
#         nodes_to_iterate = nodes_to_iterate_copy
#
#     return nodes_res, edges_res


def calculate_influence_graph(graph, remove_res, remove_id, level_threshold=10):
    filtered_change_res = {}
    nodes_res = []
    edges_res = []
    nodes_res.append({"node_id": remove_id, "level": 0})
    remains = set()
    for remove_res_item in remove_res:
        if remove_res_item["rank_change"] != 0:
            filtered_change_res[remove_res_item["node_id"]] = remove_res_item
            remains.add(remove_res_item["node_id"])

    # count appear times
    visited_nodes = {remove_id: 1}

    # count layers
    layer_count = {remove_id: 0}

    nodes_to_iterate = queue.Queue()
    nodes_to_iterate.put(remove_id)

    while not nodes_to_iterate.empty():
        node = nodes_to_iterate.get()
        for neighbor in graph.neighbors(node):
            if neighbor in filtered_change_res.keys():
                if neighbor not in visited_nodes.keys():
                    visited_nodes[neighbor] = 1
                    layer_count[neighbor] = layer_count[node] + 1
                    nodes_res.append({"node_id": neighbor, "level": layer_count[neighbor],
                                      "rank_change": filtered_change_res[neighbor]["rank_change"]})
                    edges_res.append({"source": node, "target": neighbor,
                                      "source_id": node,
                                      "target_id": neighbor,
                                      "influence": filtered_change_res[neighbor][
                                          "rank_change"]})
                    nodes_to_iterate.put(neighbor)
                    remains.remove(neighbor)
                # else:
                #     visited_nodes[neighbor] += 1
                #     new_index = visited_nodes[neighbor]
                #     node_name = neighbor + "##" + str(new_index)
                #     nodes_res.append({"node_id": node_name, "level": layer_count[neighbor],
                #                       "rank_change": filtered_change_res[neighbor]["rank_change"]})
                #     edges_res.append({"source": node, "target": node_name,
                #                       "source_id": node,
                #                       "target_id": node_name,
                #                       "influence": filtered_change_res[neighbor][
                #                           "rank_change"]})
    # print(remove_id)
    for remain_item in list(remains):
        nodes_res.append({"node_id": remain_item, "level": "inf",
                          "rank_change": filtered_change_res[remain_item]["rank_change"]})
        edges_res.append({"source": remove_id, "target": remain_item,
                          "source_id": remove_id,
                          "target_id": remain_item,
                          "influence": filtered_change_res[remain_item][
                              "rank_change"]})

    return nodes_res, edges_res
