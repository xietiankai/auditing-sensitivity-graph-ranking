import csv
import random
import time

import networkx as nx
import requests
from bs4 import BeautifulSoup
from fake_useragent import UserAgent

with open("../data/soc-redditHyperlinks-body.tsv") as tsvfile:
    tsvreader = csv.reader(tsvfile, delimiter="\t")
    node_set = set()
    new_graph = nx.DiGraph()
    for line in tsvreader:
        new_graph.add_edge(line[0], line[1], weight=1.0)
        node_set.add(line[0])
        node_set.add(line[1])
        print(line[0] + " -> " + line[1])
    Gcc = sorted(nx.weakly_connected_component_subgraphs(new_graph), key=len,
                 reverse=True)
    G0 = new_graph.subgraph(Gcc[0])
    # nx.write_gml(G0, "reddit.gml")

node_list = list(node_set)
node_list.sort()

headers = requests.utils.default_headers()
node_cat_map = {}
ua = UserAgent()
url = "https://snoopsnoo.com/r/"

index = sum(1 for line in open("node_cat_map.txt"))

f = open("node_cat_map.txt", "a+")
for it in range(index, len(node_list)):
    headers.update({'User-Agent': ua.firefox})
    try:
        req = requests.get(url + node_list[it], headers)
        soup = BeautifulSoup(req.content, 'html.parser')
        cat = soup.body.select(".breadcrumb")[0].find_all("a")[1].get_text(
            strip=True)
        f.write(node_list[it] + ":" + cat + "\r")
        print(node_list[
                  it] + ": " + cat + " has been written to the file successfully" + str(it) + " out of " + str(len(node_list)))
    except requests.exceptions.RequestException as e:
        print(e)
        f.close()
    except IndexError:
        print("Index error for: " + node_list[it])
        pass
    except ValueError:
        print("value error for: " + node_list[it])
        pass

    ua.update()
    time.sleep(random.randint(1, 5))

print("Ok")
