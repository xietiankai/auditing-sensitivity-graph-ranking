import React, {Component} from "react";
import {findDOMNode} from "react-dom";
import "./css/GraphView.css";
import {clusteringColors, graphEdgeColor, strokeColor, targetStrokeColor} from "../styles";

import * as d3 from "d3";
import {toolTipGenerator} from "../utils";

const menu = [
    {
        title: "Select at target"
    }
];

export default class GraphView extends Component {
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
        // console.log("receiveProps");
        // console.log(nextProps);
        if (
            updateMessage === "init" ||
            updateMessage === "updateClusterID" ||
            updateMessage === "changeStateID" ||
            updateMessage === "switchTab"
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
        const baseGroup = d3.select("#graph-chart-base");
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
        let baseGroup = d3.select(thisDOM).select("#graph-chart-base");
        baseGroup.remove();
        baseGroup = svgRoot.append("g").attr("id", "graph-chart-base");
        this.renderSvg(baseGroup, props);
    }

    handleSelectNode(node_id) {
        // console.log("handleSelectNode");
        this.props.updateSelectNode(node_id);
    }

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
        d3.select("body").on("click.d3-context-menu", function () {
            d3.select(".d3-context-menu").style("display", "none");
        });

        const handleMenuClick = d => {
            this.handleSelectNode(d.id.substring(5));
            d3.select("#graph-chart-base")
                .select(".nodes")
                .selectAll("circle")
                .style("stroke", strokeColor)
                .style("stroke-width", "1px");
            d3.select("#node-" + d.id.substring(5))
                .style("stroke", targetStrokeColor)
                .style("stroke-width", "3px");
            d3.select(".d3-context-menu").style("display", "none");
        };

        // this gets executed when a contextmenu event occurs
        return function (data, index) {
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
                .html(function (d) {
                    return d.title;
                })
                .on("click", () => {
                    handleMenuClick(elm);
                });

            // the openCallback allows an action to fire before the menu is displayed
            // an example usage would be closing a tooltip
            if (openCallback) openCallback(data, index);

            // display context menu
            d3.select(".d3-context-menu")
                .style("left", d3.event.pageX - 2 + "px")
                .style("top", d3.event.pageY - 2 + "px")
                .style("display", "block");

            d3.event.preventDefault();
        };
    };

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
     * Handle left clicking the node
     * @param node_id {Number}
     */
    nodeClickHandle(node_id) {
        console.log(node_id + " node clicked!!!");
        d3.select("#graph-chart-base")
            .select(".nodes")
            .selectAll("circle")
            .style("stroke", strokeColor)
            .style("stroke-width", "1px");
        d3.select("#node-" + node_id)
            .style("stroke", targetStrokeColor)
            .style("stroke-width", "3px");
        this.props.updateSelectNode(node_id);
    }

    /***
     * Render the graph chart based on the props
     * @param baseGroup {Object} d3 selected element
     * @param props {Object} from React.Component
     */
    renderSvg(baseGroup, props) {
        const {
            canvasHeight,
            canvasWidth,
            graphData,
            highlightNodeID,
            selectedNode,
            labels
        } = props;
        const circleRadius = 10;

        // console.log(graphData);
        if (graphData["nodes"] === [] || graphData["edges"] === []) return;

        const data = graphData;

        const nodeLinearScale = d3
            .scaleLinear()
            .domain(d3.extent(Object.values(data.nodes).map(item => item.influence)))
            .range([8, 10]);

        const simulation = d3
            .forceSimulation(Object.values(data.nodes))
            .force(
                "link",
                d3
                    .forceLink(data.edges)
                    .id(d => {
                        return d.node_id;
                    })
                    .distance(80)
            )
            .force("charge", d3.forceManyBody().strength(-200))
            .force("center", d3.forceCenter(canvasWidth / 2, canvasHeight / 2))
            .force("collision", d3.forceCollide(circleRadius + 15));

        const svg = baseGroup;
        const tooltip = toolTipGenerator("#graph-view");
        svg
            .append("defs")
            .append("marker")
            .attr("id", "arrowhead")
            .attr("viewBox", "-0 -5 10 10")
            .attr("refX", 18)
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
            .data(data.edges)
            .join("line")
            .attr("stroke-width", 1)
            .attr("stroke", graphEdgeColor)
            .attr("marker-end", "url(#arrowhead)");

        const node = svg
            .append("g")
            .attr("class", "nodes")
            .selectAll("g")
            .data(Object.values(data.nodes))
            .enter()
            .append("g");


        const circles = node
            .append("circle")
            .attr("id", d => "node-" + d.node_id)
            .attr("fill", d => {
                return clusteringColors[
                    labels[Object.keys(labels)[0]][d.node_id]["value"]
                    ];
            })
            .attr("stroke", "#FFFFFF")
            .attr("stroke-width", 2)
            .attr("r", d => {
                d.radius = d.node_type === "member" ? nodeLinearScale(d.influence) : 8;
                return d.radius;
            })
            .call(this.drag(simulation))
            .on("click", d => {
                d.fx = null;
                d.fy = null;
            })
            .on("contextmenu", this.contextMenu(menu))
            .on("mousemove", function (d) {
                tooltip
                    .style("left", d3.event.pageX - 50 + "px")
                    .style("top", d3.event.pageY - 60 + "px")
                    .style("display", "inline-block")
                    .html(() => {
                        return "[" + d.rank + "] " + d.node_id;
                    });
            })
            .on("mouseout", function (d) {
                tooltip.style("display", "none");
            });

        simulation.on("tick", () => {
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)

                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            // link.attr("d", function(d) {
            //   const diffX = d.target.x - d.source.x;
            //   const diffY = d.target.y - d.source.y;
            //
            //   const pathLength = Math.sqrt(diffX * diffX + diffY * diffY);
            //
            //   const offsetX = (diffX * d.target.radius) / pathLength;
            //   const offsetY = (diffY * d.target.radius) / pathLength;
            //
            //   let dx = d.target.x - offsetX - d.source.x,
            //     dy = d.target.y - offsetY - d.source.y,
            //     dr = Math.sqrt(dx * dx + dy * dy);
            //   return (
            //     "M" +
            //     d.source.x +
            //     "," +
            //     d.source.y +
            //     "A" +
            //     dr +
            //     "," +
            //     dr +
            //     " 0 0,1 " +
            //     (d.target.x - offsetX) +
            //     "," +
            //     (d.target.y - offsetY)
            //   );
            // });

            circles.attr("cx", d => d.x).attr("cy", d => d.y);

        });

        function zoomed() {
            svg.attr("transform", d3.event.transform);
        }

        const svgRoot = d3.select("#graph-chart");

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

        // if (highlightNodeID !== -1) {
        //   d3.select("#node-" + highlightNodeID)
        //     .style("stroke", "black")
        //     .style("stroke-width", "3px");
        // }
        // if (selectedNode) {
        //   d3.select("#node-" + selectedNode)
        //     .style("stroke", targetStrokeColor)
        //     .style("stroke-width", "3px");
        // }
    }

    render() {
        const {canvasHeight, canvasWidth} = this.props;
        return (
            <svg
                id="graph-chart"
                style={{height: canvasHeight, width: canvasWidth}}
            >
                <g id="graph-chart-base" style={{height: "100%", width: "100%"}}/>
            </svg>
        );
    }
}
