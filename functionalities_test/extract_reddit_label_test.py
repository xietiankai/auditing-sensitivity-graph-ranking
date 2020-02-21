res = {}

with open("../data/node_cat_map.txt") as txt_file:
    for line in txt_file:
        key_value = line.strip().split(":")
        res[key_value[0]] = key_value[1]

print(res)
