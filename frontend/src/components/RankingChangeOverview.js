import * as React from "react";
import * as d3 from "d3";
import { findDOMNode } from "react-dom";
import { clusteringColors } from "../styles";

export default class RankingChangeOverview extends React.Component {
  renderSvg(baseGroup, props) {
    const {
      canvasWidth,
      canvasHeight,
      removeRes,
      originalRanking,
      labels,
      labelNames,
      perturbation
    } = props;
    console.log("perturbation");
    console.log(perturbation);

    let nodeSet = {};
    perturbation.forEach(element => {
      nodeSet[element.node_id] = element.level;
    });
    console.log("nodeSet");
    console.log(nodeSet);
    let processedData = removeRes.map(item => {
      // console.log(item);
      return {
        id: item.node_id,
        x: originalRanking[item.node_id].rank,
        y0: 0,
        y: item.rank_change,
        level: nodeSet[item.node_id],
        cat: labels[Object.keys(labels)[0]][item.node_id]["value"]
      };
    });
    processedData.sort((a, b) => a.x - b.x);
    // console.log(processedData.length);
    // processedData = processedData.filter((d) => nodeSet.has(d.id));
    console.log("processedData");
    console.log(processedData);

    const margin = {
      top: 8,
      right: 0,
      bottom: 8,
      left: 65
    };

    const width = canvasWidth * 0.98;
    const height = canvasHeight * 0.9;

    let x = d3
      .scaleBand()
      .range([margin.left, width - margin.right])
      .padding(0.1);

    let y = d3
      .scaleLinear()
      .range([margin.top, Number(height) - Number(margin.bottom)]);

    x.domain(processedData.map(d => d.x));

    y.domain([
      d3.min(processedData, function(d) {
        return Number(d.y);
      }),
      d3.max(processedData, function(d) {
        return Number(d.y);
      })
    ]);

    baseGroup
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(
        d3.axisBottom(x).tickValues(
          x.domain().filter(function(d, i) {
            return Number(d) % 50 === 0;
          })
        )
      )
      .append("text")
      .attr("fill", "#000")
      .attr("y", 6)
      .attr("dy", "1em")
      .attr("dx", "70em")
      .attr("text-anchor", "end")
      .text("Rank");

    baseGroup
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5))
      .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "-4em")
      .attr("text-anchor", "end")
      .text("Ranking Change");

    baseGroup
      .selectAll(".bar")
      .data(processedData)
      .enter()
      .append("rect")
      .attr("class", d => {
        let classString = "";
        let level = d.level === "inf" ? 10 : d.level;
        if (d.y > 0) {
          classString += "negative bar level-" + level;
        } else {
          classString += "positive bar level-" + level;
        }
        return classString;
      })
      .attr("fill", d => clusteringColors[d.cat])
      // .attr("display", (d) => (nodeSet.has(d.id) ? "block" : "none"))
      .attr("x", function(d) {
        return x(d.x);
      })
      .attr("y", function(d) {
        if (d.y < 0) {
          return y(Number(d.y));
        } else {
          return y(0);
        }
      })
      .attr("width", x.bandwidth())
      .attr("height", function(d) {
        if (d.y < 0) {
          return y(0) - y(Number(d.y));
        } else {
          return y(Number(d.y)) - y(0);
        }
      });

    /***
     * Legend
     */
    let legend = d3.select("#rcdv-legend");
    legend.selectAll("g").remove();
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

  // UNSAFE_componentWillReceiveProps(nextProps) {
  //   console.log("UPDATING RANKING CHANGE OVEVIEW!!!");
  //   console.log(nextProps);
  //   this.updateCanvas(nextProps);
  // }

  /**
   * Entry point
   * @returns None
   */
  initializeCanvas() {
    const baseGroup = d3.select("#ranking-change-overview-chart-base");
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
    let baseGroup = d3
      .select(thisDOM)
      .select("#ranking-change-overview-chart-base");
    baseGroup.remove();
    baseGroup = svgRoot
      .append("g")
      .attr("id", "ranking-change-overview-chart-base");
    this.renderSvg(baseGroup, props);
  }

  componentDidMount() {
    this.initializeCanvas();
  }

  render() {
    const { canvasHeight, canvasWidth } = this.props;
    const svgID = "ranking-change-overview-chart";
    const svgIDBase = "ranking-change-overview-chart-base";
    return (
      <svg id={svgID} style={{ height: canvasHeight, width: canvasWidth }}>
        <g id={svgIDBase} style={{ height: "100%", width: "100%" }} />
      </svg>
    );
  }
}
