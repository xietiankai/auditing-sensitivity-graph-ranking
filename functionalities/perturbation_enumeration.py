import math

from functionalities.calculate_auditing_res import ranking_data_formation


def sort_by_rank_change(val):
    """
    Sorter by rank change
    :param val: node
    :return: nodes' rank value
    """
    return abs(float(val["rank_change"]))


def get_statistical_data(graph_data, res_list, node_id):
    positive_list = []
    negative_list = []
    for node_item in res_list:
        if node_item["rank_change"] > 0:
            positive_list.append(node_item)
        elif node_item["rank_change"] < 0:
            negative_list.append(node_item)
    positive_list.sort(key=sort_by_rank_change, reverse=True)
    negative_list.sort(key=sort_by_rank_change, reverse=True)
    res = [
        {"axis": "Influenced",
         "value": len(negative_list) + len(positive_list)},
        {"axis": "Increased #", "value": len(positive_list)},
        {"axis": "Median Incr.",
         "value": 0 if len(positive_list) == 0 else
         positive_list[math.floor(len(positive_list) / 2)]["rank_change"]},
        {"axis": "Max Incr.",
         "value": 0 if len(positive_list) == 0 else positive_list[0][
             "rank_change"]},
        {"axis": "Max Decr.",
         "value": 0 if len(negative_list) == 0 else negative_list[0][
             "rank_change"]},
        {"axis": "Median Decr.",
         "value": 0 if len(negative_list) == 0 else
         negative_list[math.floor(len(negative_list) / 2)]["rank_change"]},
        {"axis": "Decreased #", "value": len(negative_list)},
        {"axis": "Degree", "value": len(list(graph_data.neighbors(node_id)))}
    ]
    return res


def pre_perturbation(graph, node_to_remove, original_node_info, algorithm):
    """

    Args:
        graph (networkx): graph data
        node_to_remove (string): node id
        original_node_info (dict): previous node rank results
        algorithm (string): algorithm name

    Returns:
        perturbation_results = [
            { every node info, including rank_change }
        ]
    """
    graph.remove_node(node_to_remove)
    new_res_nodes, _ = ranking_data_formation(graph=graph, algorithm=algorithm)
    perturbation_results = []
    for node in new_res_nodes.values():
        node["rank_change"] = original_node_info[node["node_id"]]["rank"] - \
                              node[
                                  "rank"]
        perturbation_results.append(node)
    return perturbation_results


def perturbation_preview(graph, original_node_info, label_dict_set, algorithm):
    """
    enumerate every node perturbation
    Args:
        graph (networkx): graph data
        original_node_info (dict): calculated by ranking_data_formation()
        label_dict_set (dict): feature map
        algorithm (string): algorithm name

    Returns:
        structured_Data = [
            {
                remove_id,
                remove_res: [...],
                statistical: [{axis and value pair} ],
                node_influence: added up value,
                rank
            }
        ]

    """
    structured_data = []
    node_list = list(graph.nodes()).copy()
    for node_index, node in enumerate(node_list):
        perturbation_result = pre_perturbation(graph=graph.copy(),
                                               node_to_remove=node,
                                               original_node_info=original_node_info,
                                               algorithm=algorithm)
        statistical_data = get_statistical_data(graph.copy(),
                                                perturbation_result,
                                                node)
        influence = 0
        positive_influence = 0
        negative_influence = 0
        label_influence = {}

        for item in perturbation_result:
            influence += abs(item["rank_change"])
            for label_name, label in label_dict_set.items():
                influence_key_positive = str(label[item["node_id"]][
                                                 "label"]) + "_pos"
                influence_key_negative = str(label[item["node_id"]][
                                                 "label"]) + "_neg"
                if item["rank_change"] < 0:
                    if influence_key_negative in label_influence:
                        temp_influence = label_influence[influence_key_negative]
                        temp_influence += abs(item["rank_change"])
                    else:
                        temp_influence = abs(item["rank_change"])
                    label_influence[influence_key_negative] = temp_influence
                    negative_influence += abs(item["rank_change"])
                elif item["rank_change"] > 0:
                    if influence_key_positive in label_influence:
                        temp_influence = label_influence[influence_key_positive]
                        temp_influence += abs(item["rank_change"])
                    else:
                        temp_influence = abs(item["rank_change"])
                    label_influence[influence_key_positive] = temp_influence
                    positive_influence += abs(item["rank_change"])
                else:
                    if influence_key_positive not in label_influence:
                        label_influence[influence_key_positive] = 0
                        label_influence[influence_key_negative] = 0

        data_item = {"remove_id": node,
                     "remove_res": perturbation_result,
                     "statistical": statistical_data,
                     "node_influence": influence,
                     "positive_influence": positive_influence,
                     "negative_influence": negative_influence,
                     "label_influence": label_influence,
                     "rank": original_node_info[node]["rank"]}
        for label_name, label in label_dict_set.items():
            data_item[label_name] = label[node]
        structured_data.append(data_item)

    return structured_data
