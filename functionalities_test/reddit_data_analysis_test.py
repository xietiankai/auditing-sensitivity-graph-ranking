import csv
import json

category = {}

with open("../data/node_cat_map.txt") as txt_file:
    for line in txt_file:
        key_value = line.strip().split(":")
        category[key_value[0]] = key_value[1]

category_count = {}
category_link = {}
banedSet = {"Other", "General", "Meta", "Adult and NSFW", "Lifestyle"}
with open("../data/soc-redditHyperlinks-body.tsv") as tsvfile:
    tsvreader = csv.reader(tsvfile, delimiter="\t")
    for line in tsvreader:
        try:
            # category count
            category_key = category[line[0]]
            count = category_count.get(category_key, 0)
            count += 1
            category_count[category[line[0]]] = count
            # category link
            if category[line[0]] in banedSet or category[line[1]] in banedSet or category[line[0]] == category[line[1]]:
                continue
            link_key = category[line[0]] + "->" + category[line[1]]
            link_count = category_link.get(link_key, 0)
            link_count += 1
            category_link[link_key] = link_count

        except KeyError or TypeError:
            pass

print(json.dumps(category_count, indent=2))
print("###################################################################")
category_link = {k: v for k, v in sorted(category_link.items(), key=lambda item: item[1], reverse=True)}
print(json.dumps(category_link, indent=2))

