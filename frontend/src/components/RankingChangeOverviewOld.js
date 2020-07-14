// Copyright (c) 2016 - 2017 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React from "react";
import { VerticalBarSeries, XAxis, XYPlot, YAxis } from "react-vis";
import { clusteringColors } from "../styles";
import ChartLabel from "react-vis/es/plot/chart-label";
import * as d3 from "d3";

export default class RankingChangeOverview extends React.Component {
  componentDidMount() {
    const { labelNames } = this.props;
    /***
     * Legend
     */
    let legend = d3.select("#rcdv-legend");
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
      .text((d) => {
        return d;
      });
  }

  render() {
    const { removeRes, originalRanking, labels } = this.props;
    const processedData = removeRes.map((item) => {
      return {
        x: originalRanking[item.node_id].rank,
        y0: 0,
        y: item.rank_change,
        cat: labels[Object.keys(labels)[0]][item.node_id]["value"],
      };
    });

    const yDomain = processedData.reduce(
      (res, row) => ({
        max: Math.max(res.max, row.y, row.y0),
        min: Math.min(res.min, row.y, row.y0),
      }),
      { max: -Infinity, min: Infinity }
    );

    console.log(yDomain);

    return (
      <div style={{ paddingLeft: 10, paddingRight: 10 }}>
        <XYPlot width={720} height={100} yDomain={[yDomain.max, yDomain.min]}>
          <VerticalBarSeries
          yDomain={[yDomain.max, yDomain.min]}
            className="difference-example"
            data={processedData}
            colorType="literal"
            getColor={(d) => {
              return clusteringColors[d.cat];
              // return d.y < 0 ? greenAndRed[0] : greenAndRed[1];
            }}
          />
          <XAxis />
          <YAxis yDomain={[yDomain.max, yDomain.min]}/>
          <ChartLabel
            text="Ranking"
            className="alt-x-label"
            includeMargin={true}
            xPercent={0.92}
            yPercent={0.5}
          />

          <ChartLabel
            text="Ranking Change"
            className="alt-y-label"
            includeMargin={true}
            xPercent={0.07}
            yPercent={-0.25}
            // style={{
            //   transform: 'rotate(-90)',
            //   textAnchor: 'end'
            // }}
          />
        </XYPlot>
      </div>
    );
  }
}
