def perturbation_enumeration_statistics(perturbations):
    max_vulnerability = max(perturbations, key=lambda x: x["node_influence"])
    for index, perturbation in enumerate(perturbations):
        perturbations[index]["vul_percentile"] = perturbation[
                                                     "node_influence"] / \
                                                 max_vulnerability[
                                                     "node_influence"]
    return perturbations
