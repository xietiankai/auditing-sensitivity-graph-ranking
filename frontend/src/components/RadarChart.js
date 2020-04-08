import React, * as react from "react";
import {findDOMNode} from "react-dom";
import * as d3 from "d3";
import {infoColor, infoColorDark} from "../styles";

export default class RadarChart extends react.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.initializeCanvas(this.props);
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return false;
    }

    UNSAFE_componentWillReceiveProps(nextProps, nextContent) {
        const {updateMessage} = nextProps;
        if (
            updateMessage === "init" ||
            updateMessage === "updateVisibleSize" ||
            updateMessage === "updateBrushRange"
        ) {
            this.updateCanvas(this.props, nextProps);
        }
    }

    initializeCanvas(props) {
        const {dataset, canvasWidth, canvasHeight} = props;
        this.renderRadarChart(
            "#radar-chart-base-" + dataset["remove_id"],
            canvasWidth,
            canvasHeight,
            props
        );
    }

    updateCanvas(currentProps, nextProps) {
        const {canvasWidth, canvasHeight} = nextProps;
        const currentBaseId = "radar-chart-base-" + currentProps.dataset.remove_id;
        const thisDOM = findDOMNode(this);
        const svgRoot = d3.select(thisDOM);
        let baseGroup = d3.select(thisDOM).select("#" + currentBaseId);
        baseGroup.remove();

        const futureBaseId = "radar-chart-base-" + nextProps.dataset.remove_id;
        svgRoot.append("g").attr("id", futureBaseId);

        this.renderRadarChart(
            "#" + futureBaseId,
            canvasWidth,
            canvasHeight,
            nextProps
        );
    }

    renderRadarChart(divId, w, h, props) {
        const thisDOM = findDOMNode(this);
        const {dataset, attackSummary} = props;

        // Options for the Radar chart, other than default
        const myOptions = {
            w: w,
            h: h,
            ExtraWidthX: 0,
            ExtraWidthY: 0,
            TranslateX: 0,
            TranslateY: 0,
            labelScale: 0.7,
            levels: 5,
            levelScale: 0.85,
            facetPaddingScale: 1.9,
            maxValue: 0.6,
            showAxes: true,
            showAxesLabels: true,
            showLegend: true,
            showLevels: true,
            showLevelsLabels: false,
            showPolygons: true,
            showVertices: true
        };

        let RadarChart = {
            draw: function (id, data, options) {
                let cfg = {
                    radius: 1,
                    w: w,
                    h: h,
                    factor: 1,
                    factorLegend: 0.85,
                    levels: 3,
                    maxValue: 0,
                    radians: 2 * Math.PI,
                    opacityArea: 0.001,
                    ToRight: 5,
                    TranslateX: 60,
                    TranslateY: 40,
                    ExtraWidthX: 10,
                    ExtraWidthY: 10
                };

                if ("undefined" !== typeof options) {
                    for (let i in options) {
                        if ("undefined" !== typeof options[i]) {
                            cfg[i] = options[i];
                        }
                    }
                }
                // cfg.maxValue = Math.max(
                //   cfg.maxValue,
                //   d3.max(data, i => d3.max(i.map(o => o.value)))
                // );

                let allAxis = data[0].map(i => {
                    return [i["axis"], i["value"]];
                });

                let total = allAxis.length;
                let radius = cfg.factor * Math.min(cfg.w / 2, cfg.h / 2);

                let g = d3
                    .select(thisDOM)
                    .select(id)
                    .append("svg")
                    .attr("width", cfg.w + cfg.ExtraWidthX)
                    .attr("height", cfg.h + cfg.ExtraWidthY)
                    .attr("class", "graph-svg-component")
                    .append("g")
                    .attr(
                        "transform",
                        "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")"
                    );

                // Circular segments
                for (let j = 0; j < cfg.levels; j++) {
                    let levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels);
                    g.selectAll(".levels")
                        .data(allAxis)
                        .enter()
                        .append("svg:line")
                        .attr(
                            "x1",
                            (d, i) =>
                                levelFactor *
                                (1 - cfg.factor * Math.sin(((i + 0.5) * cfg.radians) / total))
                        )
                        .attr(
                            "y1",
                            (d, i) =>
                                levelFactor *
                                (1 - cfg.factor * Math.cos(((i + 0.5) * cfg.radians) / total))
                        )
                        .attr(
                            "x2",
                            (d, i) =>
                                levelFactor *
                                (1 - cfg.factor * Math.sin(((i + 1.5) * cfg.radians) / total))
                        )
                        .attr(
                            "y2",
                            (d, i) =>
                                levelFactor *
                                (1 - cfg.factor * Math.cos(((i + 1.5) * cfg.radians) / total))
                        )
                        .attr("class", "line")
                        .style("stroke", "grey")
                        .style("stroke-opacity", "0.75")
                        .style("stroke-width", "0.3px")
                        .attr(
                            "transform",
                            "translate(" +
                            (cfg.w / 2 - levelFactor) +
                            ", " +
                            (cfg.h / 2 - levelFactor) +
                            ")"
                        );
                }

                let series = 0;
                // console.log(allAxis);
                let axis = g
                    .selectAll(".axis")
                    .data(allAxis)
                    .enter()
                    .append("g")
                    .attr("class", "axis");

                axis
                    .append("line")
                    .attr("x1", cfg.w / 2)
                    .attr("y1", cfg.h / 2)
                    .attr(
                        "x2",
                        (d, i) =>
                            (cfg.w / 2) *
                            (1 - cfg.factor * Math.sin(((i + 0.5) * cfg.radians) / total))
                    )
                    .attr(
                        "y2",
                        (d, i) =>
                            (cfg.h / 2) *
                            (1 - cfg.factor * Math.cos(((i + 0.5) * cfg.radians) / total))
                    )
                    .attr("class", "line")
                    .style("stroke", "grey")
                    .style("stroke-opacity", "0.75")
                    .style("stroke-width", "0.5px");

                // axis
                //   .append("text")
                //   .attr("class", "legend")
                //   .style("font-size", "11px")
                //   .style("font-weight", "bold")
                //   .attr("text-anchor", "left")
                //   .attr("dy", "1.1em")
                //   .attr("transform", (d, i) => {
                //     if (i < 4) {
                //       return "translate(-35, -10)";
                //     } else {
                //       return "translate(-28, -10)";
                //     }
                //   })
                //   .attr(
                //     "x",
                //     (d, i) =>
                //       (cfg.w / 2) *
                //         (1 -
                //           cfg.factorLegend *
                //             Math.sin(((i + 0.5) * cfg.radians) / total)) -
                //       0.8 * 60 * Math.sin(((i + 0.5) * cfg.radians) / total)
                //   )
                //   .attr("y", (d, i) => {
                //     if (i >= 2 && i <= 5) {
                //       return (
                //         (cfg.h / 2) *
                //           (1 - Math.cos(((i + 0.5) * cfg.radians) / total)) -
                //         0.6 * 20 * Math.cos(((i + 0.5) * cfg.radians) / total)
                //       );
                //     } else {
                //       return (
                //         (cfg.h / 2) *
                //           (1 - Math.cos(((i + 0.5) * cfg.radians) / total)) -
                //         1.5 * 20 * Math.cos(((i + 0.5) * cfg.radians) / total)
                //       );
                //     }
                //   })
                //   .text(d => d[0]);

                // Second Row
                // axis
                //   .append("text")
                //   .attr("class", "legend")
                //   .style("font-size", "11px")
                //   .style("fill", "steelblue")
                //   .attr("text-anchor", "left")
                //   .attr("dy", "2.1em")
                //   .attr("transform", (d, i) => {
                //     if (i < 4) {
                //       return "translate(-35, -10)";
                //     } else {
                //       return "translate(-28, -10)";
                //     }
                //   })
                //   .attr(
                //     "x",
                //     (d, i) =>
                //       (cfg.w / 2) *
                //         (1 -
                //           cfg.factorLegend *
                //             Math.sin(((i + 0.5) * cfg.radians) / total)) -
                //       0.8 * 60 * Math.sin(((i + 0.5) * cfg.radians) / total)
                //   )
                //   .attr("y", (d, i) => {
                //     if (i >= 2 && i <= 5) {
                //       return (
                //         (cfg.h / 2) *
                //           (1 - Math.cos(((i + 0.5) * cfg.radians) / total)) -
                //         0.6 * 20 * Math.cos(((i + 0.5) * cfg.radians) / total)
                //       );
                //     } else {
                //       return (
                //         (cfg.h / 2) *
                //           (1 - Math.cos(((i + 0.5) * cfg.radians) / total)) -
                //         1.5 * 20 * Math.cos(((i + 0.5) * cfg.radians) / total)
                //       );
                //     }
                //   })
                //   .text((d, i) => {
                //     if (i < 4) {
                //       return d[1];
                //     } else {
                //       return d[1];
                //     }
                //   });

                const tooltip = d3
                    .select("#left-panel")
                    .append("div")
                    .style("position", "absolute")
                    .style("display", "none")
                    .style("height", "auto")
                    .style("font-family", "Sans-serif")
                    .style("font-size", "12px")
                    .style("color", "white")
                    .style("background", "none repeat scroll 0 0 #424242")
                    .style("border", "1px solid #6F257F")
                    .style("padding", "10px");

                data.forEach((y, comparisonIndex) => {
                    if (comparisonIndex === 2) return;
                    // console.log(comparisonIndex);
                    var dataValues = [];
                    g.selectAll(".nodes").data(y, (j, i) => {
                        /***
                         * For confusion matrix, max value depends on data.
                         * For Accuracy score, max value is 1.
                         */
                        // console.log(j);
                        dataValues.push([
                            (cfg.w / 2) *
                            (1 -
                                (parseFloat(Math.abs(j.value)) /
                                    Math.abs(attackSummary[i]["value"])) *
                                cfg.factor *
                                Math.sin(((i + 0.5) * cfg.radians) / total)),
                            (cfg.h / 2) *
                            (1 -
                                (parseFloat(Math.abs(j.value)) /
                                    Math.abs(attackSummary[i]["value"])) *
                                cfg.factor *
                                Math.cos(((i + 0.5) * cfg.radians) / total))
                        ]);
                    });
                    dataValues.push(dataValues[0]);
                    g.selectAll(".area")
                        .data([dataValues])
                        .enter()
                        .append("polygon")
                        .attr("class", "radar-chart-series_" + series)
                        .style("stroke-width", "2px")
                        .style("stroke", infoColorDark)
                        .attr("points", d => {
                            let str = "";
                            for (let pti = 0; pti < d.length; pti++) {
                                str = str + d[pti][0] + "," + d[pti][1] + " ";
                            }
                            return str;
                        })
                        .style("fill", infoColor)
                        .style("fill-opacity", cfg.opacityArea)
                        .on("mouseover", function (d) {
                            const z = "polygon." + d3.select(this).attr("class");
                            g.selectAll("polygon")
                                .transition(200)
                                .style("fill-opacity", 0.1);
                            g.selectAll(z)
                                .transition(200)
                                .style("fill-opacity", 0.7);

                            tooltip
                                .style("left", d3.event.pageX + 20 + "px")
                                .style("top", d3.event.pageY - 20 + "px")
                                .style("display", "inline-block")
                                .html(() => {
                                    return (
                                        "<table><tr><td>" +
                                        y[0]["axis"] +
                                        "</td><td>" +
                                        y[0]["value"] +
                                        "</td><td>" +
                                        y[7]["value"] +
                                        "</td><td>" +
                                        y[7]["axis"] +
                                        "</td></tr><tr><td>" +
                                        y[1]["axis"] +
                                        "</td><td>" +
                                        y[1]["value"] +
                                        "</td><td>" +
                                        y[6]["value"] +
                                        "</td><td>" +
                                        y[6]["axis"] +
                                        "</td></tr><tr><td>" +
                                        y[2]["axis"] +
                                        "</td><td>" +
                                        y[2]["value"] +
                                        "</td><td>" +
                                        y[5]["value"] +
                                        "</td><td>" +
                                        y[5]["axis"] +
                                        "</td></tr><tr><td>" +
                                        y[3]["axis"] +
                                        "</td><td>" +
                                        y[3]["value"] +
                                        "</td><td>" +
                                        y[4]["value"] +
                                        "</td><td>" +
                                        y[4]["axis"] +
                                        "</td></tr></table>"
                                    );
                                });
                        })
                        .on("mouseout", () => {
                            g.selectAll("polygon")
                                .transition(200)
                                .style("fill-opacity", cfg.opacityArea);
                            tooltip.style("display", "none");
                        });
                    series++;
                });
                series = 0;
            }
        };

        RadarChart.draw(divId, [dataset.statistical], myOptions);
    }

    render() {
        const {dataset, canvasHeight, canvasWidth} = this.props;
        const svgId = "radar-chart-" + dataset["remove_id"];
        const baseId = "radar-chart-base-" + dataset["remove_id"];
        return (
            <svg id={svgId} style={{height: canvasHeight, width: canvasWidth}}>
                <g id={baseId} style={{height: "100%", width: "100%"}}/>
            </svg>
        );
    }
}
