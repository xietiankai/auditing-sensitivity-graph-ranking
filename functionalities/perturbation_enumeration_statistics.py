import copy


def perturbation_enumeration_statistics(perturbations):
    max_vulnerability = max(perturbations, key=lambda x: x["node_influence"])
    for index, perturbation in enumerate(perturbations):
        perturbations[index]["vul_percentile"] = perturbation[
                                                     "node_influence"] / \
                                                 max_vulnerability[
                                                     "node_influence"]
        perturbations[index]["vul_p_percentile"] = perturbation[
                                                       "positive_influence"] / \
                                                   max_vulnerability[
                                                       "node_influence"]
        perturbations[index]["vul_n_percentile"] = perturbation[
                                                       "negative_influence"] / \
                                                   max_vulnerability[
                                                       "node_influence"]
        for key, label_influence_item in copy.deepcopy(
                perturbation["label_influence"]).items():
            perturbations[index]["label_influence"][
                key + "_percentile"] = label_influence_item / max_vulnerability[
                "node_influence"]
    return perturbations
