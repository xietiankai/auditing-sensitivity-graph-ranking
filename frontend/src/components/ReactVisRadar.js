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

import React, { Component } from "react";

import RadarChart from "react-vis/dist/radar-chart";
import CircularGridLines from "react-vis/dist/plot/circular-grid-lines";
import "react-vis/dist/style.css";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/styles";
import { radarChartMainColor } from "../styles";

const styles = themes => ({});

const mapStateToProps = state => {
  return {
    perturbationSummary: state.perturbationSummary
  };
};

class ReactVisRadar extends Component {
  render() {
    const { removedNode, perturbationSummary } = this.props;
    console.log(this.props);
    let domain = perturbationSummary.map((item, i) => ({
      name: removedNode["statistical"][i].axis,
      domain: [0, item["value"]]
    }));
    let data = {};
    removedNode["statistical"].forEach(item => {
      data[item["axis"]] = item["value"];
    });
    return (
      <div className="centered-and-flexed">
        <RadarChart
          animation
          data={[data]}
          domains={domain}
          style={{
            polygons: {
              fillOpacity: 0.5,
              strokeWidth: 0.5,
              fill: radarChartMainColor,
              stroke: radarChartMainColor
            },
            axes: {
              text: {
                fontSize: 10,
                fill: "#B5B5B5"
              },
              line: {
                fillOpacity: 0.8,
                strokeWidth: 0.5,
                strokeOpacity: 0.8
              }
            },
            labels: {
              textAnchor: "middle",
              fontSize: 10,
              fill: "#6F6F7A"
            }
          }}
          margin={{
            left: 50,
            top: 30,
            bottom: 30,
            right: 50
          }}
          tickFormat={t => ""}
          width={240}
          height={200}
          // startingAngle={0}
        >
          <CircularGridLines
            tickValues={[...new Array(7)].map((v, i) => i / 8 - 1)}
            style={{ fill: "none", stroke: "#E0E0E0", fontSize: 10 }}
          />
        </RadarChart>
      </div>
    );
  }
}

export default connect(mapStateToProps)(withStyles(styles)(ReactVisRadar));
