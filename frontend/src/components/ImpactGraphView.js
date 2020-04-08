import React, {Component} from "react";
import {findDOMNode} from "react-dom";
import "./css/GraphView.css";
import {clusteringColors, graphEdgeColor, strokeColor} from "../styles";

import * as d3 from "d3";
import {toolTipGenerator} from "../utils";

export default class ImpactGraphView extends Component {
    constructor(props) {
        super(props);
        this.handleSelectNode = this.handleSelectNode.bind(this);
    }

    componentDidMount() {
        // console.log("mount");
        this.initializeCanvas();
    }

    componentWillUnmount() {
        // console.log("unmount");
    }

    UNSAFE_componentWillReceiveProps(nextProps, nextContent) {
        const {updateMessage} = nextProps;
        console.log(this.props.perturbationLogActivateIndex);
        console.log(nextProps.perturbationLogActivateIndex);
        if (
            updateMessage === "init" ||
            updateMessage === "updateClusterID" ||
            updateMessage === "changeStateID" ||
            updateMessage === "switchTab" ||
            this.props.target !== nextProps.target ||
            this.props.perturbationLogActivateIndex !== nextProps.perturbationLogActivateIndex
        ) {
            this.updateCanvas(nextProps);
        }
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return false;
    }

    /**
     * Entry point
     * @returns None
     */
    initializeCanvas() {
        const baseGroup = d3.select("#impact-graph-chart-base");
        // console.log(baseGroup);
        this.renderSvg(baseGroup, this.props);
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

    handleSelectNode(node_id) {
        // console.log("handleSelectNode");
        this.props.updateSelectNode(node_id);
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

    /***
     * Render the graph chart based on the props
     * @param baseGroup {Object} d3 selected element
     * @param props {Object} from React.Component
     */
    renderSvg(baseGroup, props) {
        const {
            canvasHeight,
            canvasWidth,
            target,
            original,
            labels,
            perturbation,
            dataBeforeAttack,
            perturbationLogIndex
        } = props;

        const circleRadius = 13;
        const tooltip1 = toolTipGenerator("#perturbation-detail");
        const predecessorCenter = {x: canvasWidth / 2, y: canvasHeight / 2};
        const successorCenter = {x: (canvasWidth * 4.8) / 5, y: canvasHeight / 2};
        const targetCenter = {x: (canvasWidth * 3) / 5, y: canvasHeight / 2};
        const graphData = perturbation["modified"];
        console.log("Graph Data!");
        console.log(graphData);
        console.log(target);
        if (!graphData || graphData["nodes"] === [] || graphData["edges"] === [])
            return;

        let edgesData = [];
        let successorData = graphData["nodes"][target]["successors"];
        const predecessorData = graphData["nodes"][target]["predecessors"];

        // console.log(graphData);
        if (successorData) {
            successorData = successorData.filter(
                item => predecessorData.indexOf(item) < 0
            );
        }

        const successorNodes = successorData.map(item => {
            edgesData.push({source: target, target: item, type: "out"});
            return {
                node_id: item,
                type: "successor"
            };
        });

        const predecessorNodes = predecessorData.map(item => {
            edgesData.push({source: item, target: target, type: "in"});
            return {
                node_id: item,
                type: "predecessor"
            };
        });

        let nodesData = [
            {
                node_id: target,
                type: "target"
            }
        ];

        nodesData = nodesData.concat(predecessorNodes, successorNodes);
        console.log(nodesData);
        console.log(edgesData);

        const simulation = d3
            .forceSimulation(nodesData)
            .force(
                "link",
                d3
                    .forceLink(edgesData)
                    .id(d => {
                        return d.node_id;
                    })
                    .distance(200)
            )
            .force("charge", d3.forceManyBody().strength(-10))
            .force("center", d3.forceCenter(canvasWidth / 2, canvasHeight / 2))
            .force("collision", d3.forceCollide(circleRadius + 25));

        const svg = baseGroup;

        svg
            .append("defs")
            .append("marker")
            .attr("id", "arrowhead")
            .attr("viewBox", "-0 -5 10 10")
            .attr("refX", 40)
            .attr("refY", 0)
            .attr("orient", "auto")
            .attr("markerWidth", 8)
            .attr("markerHeight", 8)
            .attr("xoverflow", "visible")
            .append("svg:path")
            .attr("d", "M 0,-5 L 10 ,0 L 0,5")
            .attr("fill", "#999")
            .style("stroke", "none");

        const link = svg
            .append("g")
            .attr("class", "edges")
            .attr("stroke-opacity", 0.5)
            .selectAll("line")
            .data(edgesData)
            .join("line")
            .attr("stroke-width", 1)
            .attr("stroke", graphEdgeColor)
            .attr("marker-end", "url(#arrowhead)");

        const node = svg
            .append("g")
            .attr("class", "nodes")
            .selectAll("g")
            .data(nodesData)
            .enter()
            .append("g");

        /***
         *
         */

        const rankRing1 = node
            .append("path")
            .attr(
                "d",
                d3
                    .arc()
                    .innerRadius(20)
                    .outerRadius(25)
                    .startAngle(d => {
                        const beforeRank = dataBeforeAttack["nodes"][d.node_id]["rank"];
                        const afterRank =
                            perturbation["modified"]["nodes"][d.node_id]["rank"];
                        if (beforeRank <= afterRank) {
                            return 0;
                        } else {
                            const maxChange = 150;
                            const percentage = (beforeRank - afterRank) / maxChange;
                            return Math.PI / 2 - (Math.PI / 2) * percentage;
                        }
                    })
                    .endAngle(Math.PI / 2)
            )
            .attr("fill", function (d) {
                if (!perturbation["modified"]["nodes"][d.node_id]) {
                    return "grey";
                }
                const beforeRank = dataBeforeAttack["nodes"][d.node_id]["rank"];
                const afterRank = perturbation["modified"]["nodes"][d.node_id]["rank"];
                if (beforeRank <= afterRank) {
                    return "#ffffff";
                } else {
                    return "green";
                }
            })
            .attr("stroke", strokeColor)
            .attr("transform", d => "translate(" + d.x + "," + d.y + ")")
            .style("stroke-width", "1px")
            .style("opacity", 0.7);

        const rankRing2 = node
            .append("path")
            .attr(
                "d",
                d3
                    .arc()
                    .innerRadius(20)
                    .outerRadius(25)
                    .startAngle(Math.PI / 2)
                    .endAngle(d => {
                        if (!perturbation["modified"]["nodes"][d.node_id]) {
                            return Math.PI;
                        }
                        const beforeRank = dataBeforeAttack["nodes"][d.node_id]["rank"];
                        const afterRank =
                            perturbation["modified"]["nodes"][d.node_id]["rank"];
                        if (beforeRank >= afterRank) {
                            return Math.PI;
                        } else {
                            const maxChange = 200;
                            const percentage = (afterRank - beforeRank) / maxChange;
                            return Math.PI / 2 + (Math.PI / 2) * percentage;
                        }
                    })
            )
            .attr("fill", function (d) {
                if (!perturbation["modified"]["nodes"][d.node_id]) {
                    return "grey";
                }
                const beforeRank = dataBeforeAttack["nodes"][d.node_id]["rank"];
                const afterRank = perturbation["modified"]["nodes"][d.node_id]["rank"];
                if (beforeRank >= afterRank) {
                    return "#ffffff";
                } else {
                    return "red";
                }
            })
            .attr("stroke", strokeColor)
            .attr("transform", d => "translate(" + d.x + "," + d.y + ")")
            .style("stroke-width", "1px")
            .style("opacity", 0.7);

        const rankRing3 = node
            .append("path")
            .attr(
                "d",
                d3
                    .arc()
                    .innerRadius(20)
                    .outerRadius(25)
                    .startAngle(Math.PI * 1.5)
                    .endAngle(d => {
                        if (!perturbation["modified"]["nodes"][d.node_id]) {
                            return Math.PI;
                        }
                        const beforeRank =
                            dataBeforeAttack["nodes"][d.node_id]["rank_value"] * 100;
                        const afterRank =
                            perturbation["modified"]["nodes"][d.node_id]["rank_value"] * 100;
                        if (beforeRank <= afterRank) {
                            return Math.PI;
                        } else {
                            const maxChange = 1;
                            const percentage = (beforeRank - afterRank) / maxChange;
                            return Math.PI - (Math.PI / 2) * percentage;
                        }
                    })
            )
            .attr("fill", function (d) {
                if (!perturbation["modified"]["nodes"][d.node_id]) {
                    return "grey";
                }
                const beforeRank =
                    dataBeforeAttack["nodes"][d.node_id]["rank_value"] * 100;
                const afterRank =
                    perturbation["modified"]["nodes"][d.node_id]["rank_value"] * 100;
                if (beforeRank <= afterRank) {
                    return "#ffffff";
                } else {
                    return "red";
                }
            })
            .attr("stroke", strokeColor)
            .attr("transform", d => "translate(" + d.x + "," + d.y + ")")
            .style("stroke-width", "1px")
            .style("opacity", 0.7);

        const rankRing4 = node
            .append("path")
            .attr(
                "d",
                d3
                    .arc()
                    .innerRadius(20)
                    .outerRadius(25)
                    .startAngle(Math.PI * 1.5)
                    .endAngle(d => {
                        if (!perturbation["modified"]["nodes"][d.node_id]) {
                            return Math.PI * 2;
                        }
                        const beforeRank =
                            dataBeforeAttack["nodes"][d.node_id]["rank_value"] * 100;
                        const afterRank =
                            perturbation["modified"]["nodes"][d.node_id]["rank_value"] * 100;
                        if (beforeRank >= afterRank) {
                            return Math.PI * 2;
                        } else {
                            const maxChange = 1;
                            const percentage = (afterRank - beforeRank) / maxChange;
                            return Math.PI * 1.5 + (Math.PI / 2) * percentage;
                        }
                    })
            )
            .attr("fill", function (d) {
                if (!perturbation["modified"]["nodes"][d.node_id]) {
                    return "grey";
                }
                const beforeRank =
                    dataBeforeAttack["nodes"][d.node_id]["rank_value"] * 100;
                const afterRank =
                    perturbation["modified"]["nodes"][d.node_id]["rank_value"] * 100;
                if (beforeRank >= afterRank) {
                    return "#ffffff";
                } else {
                    return "green";
                }
            })
            .attr("stroke", strokeColor)
            .attr("transform", d => "translate(" + d.x + "," + d.y + ")")
            .style("stroke-width", "1px")
            .style("opacity", 0.7);

        const circles = node
            .append("circle")
            .attr("id", d => "node-" + d.node_id)
            .attr(
                "fill",
                d =>
                    clusteringColors[labels[Object.keys(labels)[0]][d.node_id]["value"]]
            )
            .attr("stroke", d => {
                if (d.type === "target") {
                    return "#000";
                } else {
                    return "#FFF";
                }
            })
            .attr("stroke-width", 2)
            .attr("r", d => {
                if (d.type === "target") {
                    return circleRadius;
                } else {
                    return circleRadius;
                }
            })
            .call(this.drag(simulation))
            .on("click", d => {
                d.fx = null;
                d.fy = null;
            })
            .on("mousemove", function (d) {
                tooltip1
                    .style("left", () => {
                        return d3.event.pageX + 1920 + "px";
                    })
                    .style("top", () => {
                        return d3.event.pageY - 50 + "px";
                    })
                    .style("display", "inline-block")
                    .html(() => {
                        return (
                            "<div>" +
                            d.node_id +
                            "</div>" +
                            "<div>" +
                            (
                                dataBeforeAttack["nodes"][d.node_id]["rank_value"] * 100
                            ).toFixed(3) +
                            "%</div>" +
                            "<div>" +
                            (
                                perturbation["modified"]["nodes"][d.node_id]["rank_value"] * 100
                            ).toFixed(3) +
                            "%</div>" +
                            "<div>" +
                            dataBeforeAttack["nodes"][d.node_id]["rank"] +
                            "</div>" +
                            "<div>" +
                            perturbation["modified"]["nodes"][d.node_id]["rank"] +
                            "</div>"
                        );
                    });
            })
            .on("mouseout", function (d) {
                tooltip1.style("display", "none");
            });

        simulation.on("tick", () => {
            let k = 0.228 * 0.1;

            nodesData.forEach((n, i) => {
                if (n.type === "successor") {
                    n.x += (successorCenter.x - n.x) * k;
                    n.y += (successorCenter.y - n.y) * k;
                } else if (n.type === "predecessor") {
                    n.x += (predecessorCenter.x - n.x) * k;
                    n.y += (predecessorCenter.y - n.y) * k;
                } else {
                    n.x += (targetCenter.x - n.x) * k;
                    n.y += (targetCenter.y - n.y) * k;
                }
            });

            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)

                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            circles.attr("cx", d => d.x).attr("cy", d => d.y);

            rankRing1.attr("transform", d => "translate(" + d.x + "," + d.y + ")");
            rankRing2.attr("transform", d => "translate(" + d.x + "," + d.y + ")");
            rankRing3.attr("transform", d => "translate(" + d.x + "," + d.y + ")");
            rankRing4.attr("transform", d => "translate(" + d.x + "," + d.y + ")");
        });

        function zoomed() {
            svg.attr("transform", d3.event.transform);
        }

        const svgRoot = d3.select("#impact-graph-chart");

        svgRoot.call(
            d3
                .zoom()
                .extent([
                    [0, 0],
                    [canvasWidth, canvasHeight]
                ])
                .scaleExtent([0, 8])
                .on("zoom", zoomed)
        );
    }

    render() {
        const {canvasHeight, canvasWidth} = this.props;
        return (
            <svg
                id="impact-graph-chart"
                style={{height: canvasHeight, width: canvasWidth}}
            >
                <g
                    id="impact-graph-chart-base"
                    style={{height: "100%", width: "100%"}}
                />
            </svg>
        );
    }
}
