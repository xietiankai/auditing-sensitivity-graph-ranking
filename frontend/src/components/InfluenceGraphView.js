import * as React from "react";
import * as d3 from "d3";
import { findDOMNode } from "react-dom";
import { circleStrokeColor, clusteringColors, greenAndRed } from "../styles";
import "../components/css/InfluenceGraphView.css";
import { toolTipGenerator } from "../utils";

const circleMenu = [
  {
    title: "Add to protected nodes"
  }
];

const lassoMenu = [
  {
    title: "Add to protected nodes"
  }
];

export default class InfluenceGraphView extends React.Component {
  componentDidMount() {
    // console.log("mount");
    this.initializeCanvas();
  }

  /***
   * Graph simulation when dragging the node
   * @param simulation {Object} d3 simulation
   * @returns {Function} d3 function
   */
  drag = simulation => {
    function dragStarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragEnded(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = d.x;
      d.fy = d.y;
    }

    return d3
      .drag()
      .on("start", dragStarted)
      .on("drag", dragged)
      .on("end", dragEnded);
  };

  addProtectedNodesHelper2 = newNodesToAdd => {
    this.props.addProtectedNodes(newNodesToAdd);
  };

  contextMenu = (menu, openCallback) => {
    // create the div element that will hold the context menu
    d3.selectAll(".d3-context-menu")
      .data([1])
      .enter()
      .append("div")
      .attr("class", "d3-context-menu")
      .style("position", "absolute")
      .style("background-color", "#f2f2f2")
      .style("border-radius", "4px")
      .style("min-width", "150px")
      .style("border", "1px solid #d4d4d4")
      .style("font-family", "Arial, sans-serif")
      .style("z-index", 1500);

    // close menu
    d3.select("body").on("click.d3-context-menu", function() {
      d3.select(".d3-context-menu").style("display", "none");
    });

    const addProtectedNodesHelper1 = newNodesToAdd => {
      this.addProtectedNodesHelper2(newNodesToAdd);
    };

    const handleMenuClick = d => {
      d3.select(".d3-context-menu").style("display", "none");
      // console.log(d._groups);
      const newNodesToAdd = d._groups[0].map(item => {
        return item.id.slice(5);
      });
      addProtectedNodesHelper1(newNodesToAdd);
    };

    // this gets executed when a contextmenu event occurs
    return function(data, index) {
      // console.log(data);
      // console.log(index);
      let elm = this;

      d3.selectAll(".d3-context-menu").html("");
      let list = d3
        .selectAll(".d3-context-menu")
        .append("ul")
        .style("list-style-type", "none")
        .style("margin", "4px 0px")
        .style("padding", "0px")
        .style("cursor", "default");

      list
        .selectAll("li")
        .data(menu)
        .enter()
        .append("li")
        .attr("id", (d, i) => {
          return "list-item-hover" + i;
        })
        .style("padding", "4px 16px")
        .html(function(d) {
          return d.title;
        })
        .on("click", () => {
          handleMenuClick(elm);
        });

      // the openCallback allows an action to fire before the menu is displayed
      // an example usage would be closing a tooltip
      if (openCallback) openCallback(data, index);

      if (d3.event.type === "mousedown") {
        d3.select(".d3-context-menu")
          .style("left", d3.event.pageX - 2 + "px")
          .style("top", d3.event.pageY - 2 + "px")
          .style("display", "block");
        d3.event.preventDefault();
      } else {
        d3.select(".d3-context-menu")
          .style("left", d3.event.sourceEvent.clientX - 2 + "px")
          .style("top", d3.event.sourceEvent.clientY - 2 + "px")
          .style("display", "block");
      }
    };
  };

  renderSvg(baseGroup, props) {
    const {
      perturbation,
      canvasWidth,
      canvasHeight,
      labels,
      labelNames,
      removedID
    } = props;
    if (
      !perturbation ||
      perturbation["influence_graph_nodes"] === [] ||
      perturbation["influence_graph_edges"] === []
    )
      return;
    const tooltip = toolTipGenerator("#influence-graph-view");
    let nodesData = perturbation["influence_graph_nodes"];
    let edgesData = perturbation["influence_graph_edges"];

    /***
     * Graph simulation
     */
    const simulation = d3
      .forceSimulation(nodesData)
      .force(
        "link",
        d3
          .forceLink(edgesData)
          .id(d => {
            return d.node_id;
          })
          .distance(d => {
            if (d.target.level === "inf") {
              return 600;
            }
            //return d.target.level * 10;
            // return Math.exp(d.target.level) *5
            return 150;
          })
      )
      .force("many", d3.forceManyBody().strength(-3))
      .force(
        "r",
        d3.forceRadial(function(d) {
          if (d.level === "inf") return 600;
          else return d.level * 100;
        })
      )
      // .force("charge", d3.forceCollide().radius(6))
      .force("center", d3.forceCenter(canvasWidth / 2, canvasHeight / 2));

    const svg = baseGroup;

    /*****
     * Drawing Graphs
     */
    svg
      .append("defs")
      .append("marker")
      .attr("id", "arrowhead-pos")
      .attr("markerUnits", "userSpaceOnUse")
      .attr("viewBox", "-0 -5 10 10")
      .attr("refX", 20)
      .attr("refY", 0)
      .attr("orient", "auto")
      .attr("markerWidth", 8)
      .attr("markerHeight", 8)
      .attr("xoverflow", "visible")
      .append("svg:path")
      .attr("d", "M 0,-5 L 10 ,0 L 0,5")
      .attr("fill", greenAndRed[0])
      .attr("opacity", 0.5)
      .style("stroke", "none");

    svg
      .append("defs")
      .append("marker")
      .attr("id", "arrowhead-neg")
      .attr("markerUnits", "userSpaceOnUse")
      .attr("viewBox", "-0 -5 10 10")
      .attr("refX", 20)
      .attr("refY", 0)
      .attr("orient", "auto")
      .attr("markerWidth", 8)
      .attr("markerHeight", 8)
      .attr("xoverflow", "visible")
      .append("svg:path")
      .attr("d", "M 0,-5 L 10 ,0 L 0,5")
      .attr("fill", greenAndRed[1])
      .attr("opacity", 0.7)
      .style("stroke", "none");

    const edgeScale = d3
      .scaleLinear()
      .domain(d3.extent(edgesData, d => Math.abs(d.influence)))
      .range([2, 8]);

    const link = svg
      .append("g")
      .attr("class", "edges")
      .attr("stroke-opacity", 0.7)
      .selectAll(".edges")
      .data(edgesData)
      .enter()
      .append("path")
      .attr("class", d => {
        let classString = "";
        if (d.target.rank_change > 0) {
          if (d.target.level === "inf") {
            classString += "negative level-" + 10;
          } else {
            classString += "negative level-" + d.target.level;
          }
        } else {
          if (d.target.level === "inf") {
            classString += "positive level-" + 10;
          } else {
            classString += "positive level-" + d.target.level;
          }
        }
        return classString;
      })
      .attr("stroke-width", d => {
        return edgeScale(Math.abs(d.influence));
      })
      .attr("fill", "none")
      .attr("stroke", d => {
        if (d.influence > 0) {
          return greenAndRed[1];
        } else {
          return greenAndRed[0];
        }
      })
      .style("stroke-dasharray", d => {
        if (d.target.level === "inf") {
          return "3, 3";
        }
      })
      .attr("marker-end", d => {
        if (d.influence > 0) {
          return "url(#arrowhead-neg)";
        } else {
          return "url(#arrowhead-pos)";
        }
      });

    const node = svg
      .append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(nodesData)
      .enter()
      .append("g");

    const nodeScale = d3
      .scaleLinear()
      .domain(d3.extent(nodesData, d => Math.abs(d.rank_change)))
      .range([5, 15]);

    const circles = node
      .append("circle")
      .attr("class", d => {
        let classString = "";
        if (d.level !== 0 || d.level === "inf") {
          if (d.rank_change > 0) {
            if (d.level === "inf") {
              classString += "negative level-" + 10;
            } else {
              classString += "negative level-" + d.level;
            }
          } else {
            if (d.level === "inf") {
              classString += "positive level-" + 10;
            } else {
              classString += "positive level-" + d.level;
            }
          }
        } else {
          classString += "target level-0";
        }
        return classString;
      })
      .attr("id", d => "node-" + d.node_id)
      .attr("fill", d => {
        if (d.level === "inf") {
          return "white";
        } else {
          if (labels[Object.keys(labels)[0]][d.node_id]) {
            return clusteringColors[
              labels[Object.keys(labels)[0]][d.node_id]["value"]
            ];
          } else {
            // console.log(d.node_id.split("_")[0]);
            return clusteringColors[
              labels[Object.keys(labels)[0]][d.node_id.split("##")[0]]["value"]
            ];
          }
        }
      })
      .attr("stroke", d => {
        if (d.level === 0) {
          return "black";
        } else if (d.level === "inf") {
          if (labels[Object.keys(labels)[0]][d.node_id]) {
            return clusteringColors[
              labels[Object.keys(labels)[0]][d.node_id]["value"]
            ];
          } else {
            return clusteringColors[
              labels[Object.keys(labels)[0]][d.node_id.split("##")[0]]["value"]
            ];
          }
        } else {
          return circleStrokeColor;
        }
      })
      .attr("stroke-width", d => {
        if (d.level === 0) {
          return 2;
        } else if (d.level === "inf") {
          return 3;
        } else {
          return 1;
        }
      })
      .attr("r", d => {
        if (d.level === 0) {
          return 15;
        } else {
          return nodeScale(Math.abs(d.rank_change));
        }
      })
      .call(this.drag(simulation))
      .on("click", d => {
        d.fx = null;
        d.fy = null;
      })
      .on("mousemove", function(d) {
        tooltip
          .style("left", () => {
            return d3.event.pageX - 600 + "px";
          })
          .style("top", () => {
            return d3.event.pageY - 500 + "px";
          })
          .style("display", "inline-block")
          .html(() => {
            return "<div>" + d.node_id + "( " + d.rank_change + ")</div>";
          });
      })
      .on("mouseout", function(d) {
        tooltip.style("display", "none");
      })
      .on("contextmenu", this.contextMenu(circleMenu));

    node
      .append("text")
      .text(d => (d.level === 0 ? d.node_id : ""))
      .attr("dy", "5em")
      .attr("dx", "8em")
      .attr("font-size", "1.2em");

    simulation.on("tick", () => {
      //   link
      //     .attr("x1", (d) => d.source.x)
      //     .attr("y1", (d) => d.source.y)

      //     .attr("x2", (d) => d.target.x)
      //     .attr("y2", (d) => d.target.y);

      link.attr("d", positionLink);

      circles.attr("cx", d => d.x).attr("cy", d => d.y);
    });

    function zoomed() {
      svg.attr("transform", d3.event.transform);
    }

    // links are drawn as curved paths between nodes,
    // through the intermediate nodes
    function positionLink(d) {
      let offset = 30;
      offset = d.target.level === "inf" ? offset + 180 : -offset;
      //   offset = d.influence > 0 ? -offset : offset;

      let midpoint_x = (d.source.x + d.target.x) / 2;
      let midpoint_y = (d.source.y + d.target.y) / 2;

      let dx = d.target.x - d.source.x;
      let dy = d.target.y - d.source.y;

      let normalise = Math.sqrt(dx * dx + dy * dy);

      let offSetX = midpoint_x + offset * (dy / normalise);
      let offSetY = midpoint_y - offset * (dx / normalise);

      return (
        "M" +
        d.source.x +
        "," +
        d.source.y +
        "S" +
        offSetX +
        "," +
        offSetY +
        " " +
        d.target.x +
        "," +
        d.target.y
      );
    }

    const svgRoot = d3.select("#impact-graph-chart-" + removedID);

    svgRoot.call(
      d3
        .zoom()
        .extent([
          [0, 0],
          [canvasWidth, canvasHeight]
        ])
        .scaleExtent([0, 8])
        .on("zoom", zoomed)
        .filter(function() {
          switch (d3.event.type) {
            case "mousedown":
              return d3.event.button === 1;
            case "wheel":
              return d3.event.button === 0;
            default:
              return false;
          }
        })
    );

    /***
     * Lasso
     */
    const handleLassoSelect = item => {
      this.contextMenu(lassoMenu).call(item);
    };

    // Lasso functions
    let lasso_start = function() {
      lasso
        .items()
        .classed("not_possible", true)
        .classed("selected", false);
    };

    let lasso_draw = function() {
      // Style the possible dots
      lasso
        .possibleItems()
        .classed("not_possible", false)
        .classed("possible", true);

      // Style the not possible dot
      lasso
        .notPossibleItems()
        .classed("not_possible", true)
        .classed("possible", false);
    };

    let lasso_end = function() {
      // Reset the color of all dots
      lasso
        .items()
        .classed("not_possible", false)
        .classed("possible", false);

      // Style the selected dots
      lasso.selectedItems().classed("selected", true);
      lasso.selectedItems().call(handleLassoSelect);
    };

    let lasso = d3
      .lasso()
      .closePathSelect(true)
      .closePathDistance(100)
      .items(circles)
      .targetArea(svgRoot)
      .on("start", lasso_start)
      .on("draw", lasso_draw)
      .on("end", lasso_end);

    svgRoot.call(lasso);

    /***
     * Legend
     */
    let legend = d3.select("#graph-legend");
    let legendModule = legend
      .selectAll(".legend-group")
      .data(labelNames)
      .enter()
      .append("g");

    legendModule
      .append("rect")
      .attr("x", (d, i) => i * 7 + 7 + "em")
      .attr("y", "1em")
      .attr("width", 8)
      .attr("height", 8)
      .attr("fill", (d, i) => clusteringColors[i]);

    legendModule
      .append("text")
      .attr("x", (d, i) => i * 7 + 8.5 + "em")
      .attr("y", "1.5em")
      .text(d => {
        return d;
      });
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return false;
  }

  /**
   * Entry point
   * @returns None
   */
  initializeCanvas() {
    const { removedID } = this.props;

    const baseGroup = d3.select("#impact-graph-chart-base-" + removedID);
    this.renderSvg(baseGroup, this.props);
    baseGroup.raise();
  }

  /***
   * When updating the props, according canvas needs to be updated.
   * Remove original canvas and draw a new one.
   * @param props {Object} from React.Component
   */
  updateCanvas(props) {
    const thisDOM = findDOMNode(this);
    const svgRoot = d3.select(thisDOM);
    let baseGroup = d3.select(thisDOM).select("#impact-graph-chart-base");
    baseGroup.remove();
    baseGroup = svgRoot.append("g").attr("id", "impact-graph-chart-base");
    this.renderSvg(baseGroup, props);
  }

  render() {
    const { canvasHeight, canvasWidth, removedID } = this.props;
    const svgID = "impact-graph-chart-" + removedID;
    const svgIDBase = "impact-graph-chart-base-" + removedID;
    return (
      <svg id={svgID} style={{ height: canvasHeight, width: canvasWidth }}>
        <g id={svgIDBase} style={{ height: "100%", width: "100%" }} />
      </svg>
    );
  }
}
