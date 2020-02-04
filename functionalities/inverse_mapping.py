def inverse_mapping(data):
    res = {}
    for data_item in data:
        for remove_res_item in data_item["remove_res"]:
            if remove_res_item["node_id"] in res:
                attack_list = res[remove_res_item["node_id"]]
            else:
                attack_list = []
            if remove_res_item["rank_change"] != 0:
                attack_list.append({"node_id": data_item["remove_id"],
                                    "rank_change": remove_res_item[
                                        "rank_change"]})
            res[remove_res_item["node_id"]] = attack_list

    return res
