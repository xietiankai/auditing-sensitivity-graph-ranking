import csv
import json

import networkx as nx

category = {}

with open("../data/node_cat_map.txt") as txt_file:
    for line in txt_file:
        key_value = line.strip().split(":")
        category[key_value[0]] = key_value[1]

category_count = {}
category_link = {}
graph = nx.DiGraph()

banedSet = {}
whiteSet = {"Sports", "Other", "General"}

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
            # if category[line[0]] in banedSet or category[line[1]] in banedSet or category[line[0]] == category[line[1]]:
            #     continue
            # if category[line[0]] not in whiteSet or category[line[1]] not in whiteSet or category[line[0]] == category[line[1]]:
            #     continue
            if category[line[0]] not in whiteSet or category[line[1]] not in whiteSet:
                continue
            link_key = category[line[0]] + "->" + category[line[1]]
            link_count = category_link.get(link_key, 0)
            link_count += 1
            category_link[link_key] = link_count
            graph.add_node(line[0], category=category[line[0]])
            graph.add_node(line[1], category=category[line[1]])
            graph.add_edge(line[0], line[1], weight=1.0)

        except KeyError or TypeError:
            pass

print(json.dumps(category_count, indent=2))
print("###################################################################")
category_link = {k: v for k, v in sorted(category_link.items(), key=lambda item: item[1], reverse=True)}
print(json.dumps(category_link, indent=2))

# plt.figure(figsize=(30,30))
# nx.draw_networkx(graph, with_labels=True)
# plt.tick_params(axis='x', which='both', bottom=False, top=False, labelbottom=False)
# plt.tick_params(axis='y', which='both', right=False, left=False, labelleft=False)
# for pos in ['right','top','bottom','left']:
#     plt.gca().spines[pos].set_visible(False)
#
# plt.show()
nx.write_gml(graph, "../data/reddit.gml")
