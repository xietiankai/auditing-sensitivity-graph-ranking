from functionalities.calculate_auditing_res import ranking_data_formation
from functionalities.calculate_influence_graph import calculate_influence_graph
from functionalities.load_data import load_data_from_text
from functionalities.perturbation_enumeration import perturbation_preview

graph_object, label_dict_set = load_data_from_text(data_name="polblogs")

nodes, edges = ranking_data_formation(graph=graph_object,
                                      algorithm="pagerank")
print("graph loaded")
perturbations = perturbation_preview(graph=graph_object.copy(),
                                     original_node_info=nodes,
                                     label_dict_set=label_dict_set,
                                     algorithm="pagerank")
print("perturbations")
nodes_res, edges_res = calculate_influence_graph(graph=graph_object,
                                                 remove_res=perturbations[0]["remove_res"],
                                                 remove_id=perturbations[0][
                                                     "remove_id"])
print("finished")
