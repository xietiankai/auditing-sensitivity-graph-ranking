def summarize_perturbation_effect(perturbations):
    max_degree = 0
    max_median_pos = 0
    max_median_negative = 0
    max_max_positive = 0
    max_max_negative = 0
    for item in perturbations:
        max_degree = max(max_degree, item["statistical"][4]["value"])

        max_max_positive = max(max_max_positive,
                               item["statistical"][2]["value"])
        max_max_negative = max(max_max_negative,
                               item["statistical"][6]["value"])
        max_median_pos = max(max_median_pos, item["statistical"][3]["value"])
        max_median_negative = max(max_median_negative,
                                  item["statistical"][5]["value"])

        max_median = max(max_median_pos, max_max_negative)
        max_max = max(max_max_negative, max_max_positive)

    res = [
        {"id": "max_number_influence", "value": len(perturbations)},
        {"id": "max_number_positive_influence", "value": len(perturbations)},
        {"id": "max_max_positive_influence", "value": max_max},
        {"id": "max_median_positive_influence", "value": max_median},
        {"id": "max_degree", "value": len(perturbations)},
        {"id": "max_median_negative_influence", "value": max_median},
        {"id": "max_max_negative_influence", "value": max_max},
        {"id": "max_number_negative_influence", "value": len(perturbations)},
    ]
    return res
