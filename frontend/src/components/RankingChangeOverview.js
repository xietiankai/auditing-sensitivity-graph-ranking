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
import {VerticalBarSeries, XAxis, XYPlot, YAxis} from "react-vis";
import {clusteringColors} from "../styles";
import ChartLabel from "react-vis/es/plot/chart-label";

export default class RankingChangeOverview extends React.Component {
  render() {
    const { removeRes, originalRanking, labels } = this.props;
    const processedData = removeRes.map((item) => {
      return {
        x: originalRanking[item.node_id].rank,
        y0: 0,
        y: item.rank_change,
        cat: labels[Object.keys(labels)[0]][item.node_id]["value"]
      }
    });

    const yDomain = processedData.reduce(
      (res, row) => ({
        max: Math.max(res.max, row.y, row.y0),
        min: Math.min(res.min, row.y, row.y0)
      }),
      { max: -Infinity, min: Infinity }
    );
    return (
      <div>
        <XYPlot width={720} height={100} yDomain={[yDomain.min, yDomain.max]}>
          <VerticalBarSeries
            className="difference-example"
            data={processedData}
            colorType="literal"
            getColor={d => {
              return clusteringColors[d.cat];
              // return d.y < 0 ? greenAndRed[0] : greenAndRed[1];
            }}
          />
          <XAxis />
          <YAxis />
          <ChartLabel
            text="Ranking Positions"
            className="alt-x-label"
            includeMargin={false}
            xPercent={0.025}
            yPercent={1.01}
            />

          <ChartLabel
            text="Ranking Changes"
            className="alt-y-label"
            includeMargin={false}
            xPercent={0.06}
            yPercent={0.06}
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
