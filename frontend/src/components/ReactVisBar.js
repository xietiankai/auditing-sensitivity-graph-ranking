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
import {greenAndRed} from "../styles";
import VerticalGridLines from "react-vis/es/plot/vertical-grid-lines";
import HorizontalGridLines from "react-vis/es/plot/horizontal-grid-lines";
import "react-vis/dist/style.css";

const myDATA = [
    {id: "00036", y: 200400, x: 1504121437},
    {id: "00036", y: 200350, x: 1504121156},
    {id: "00036", y: 200310, x: 1504120874},
    {id: "00036", y: 200260, x: 1504120590},
    {id: "00036", y: 200210, x: 1504120306},
    {id: "00036", y: 200160, x: 1504120024},
    {id: "00036", y: 200120, x: 1504119740},
    {id: "00036", y: 200070, x: 1504119458},
    {id: "00036", y: 200020, x: 1504119177},
    {id: "00036", y: 199980, x: 1504118893},
    {id: "00036", y: 199930, x: 1504118611},
    {id: "00036", y: 199880, x: 1504118330},
    {id: "00036", y: 199830, x: 1504118048},
    {id: "00036", y: 199790, x: 1504117763},
    {id: "00036", y: 199740, x: 1504117481}
];

export default class ReactVisBar extends React.Component {
    render() {
        const {dataset, visibleSize, rankInfluencerange} = this.props;
        let data = dataset.remove_res;
        data.sort((a, b) => {
            if (Math.abs(a.rank_change) < Math.abs(b.rank_change)) {
                return 1;
            } else if (Math.abs(a.rank_change) > Math.abs(b.rank_change)) {
                return -1;
            } else {
                return Math.abs(a.node_id) < Math.abs(b.node_id) ? 1 : -1;
            }
        });
        data = data.map(item => ({
            x:
                typeof item["node_id"] === "number"
                    ? "node " + item["node_id"]
                    : item["node_id"],
            y: Math.abs(item["rank_change"]),
            color: item["rank_change"] > 0 ? greenAndRed[0] : greenAndRed[1]
        }));
        const yDomain = data.reduce(
            (res, row) => {
                return {
                    max: Math.max(res.max, row.y),
                    min: Math.min(res.min, row.y)
                };
            },
            {max: -Infinity, min: Infinity}
        );
        data = data.slice(0, visibleSize);
        // console.log(data);

        return (
            <div>
                <XYPlot
                    margin={{left: 75, top: 30, bottom: 80}}
                    xType={"ordinal"}
                    width={380}
                    height={200}
                    yDomain={[0, yDomain.max]}
                    style={{fontSize: 10}}
                >

                    <VerticalGridLines/>
                    <HorizontalGridLines/>
                    <XAxis style={{fontSize: 9}} tickLabelAngle={-75}/>
                    <YAxis/>
                    <VerticalBarSeries
                        className="vertical-bar-series-example"
                        data={data}
                        barWidth={0.8}
                        colorType="literal"
                    />
                </XYPlot>
            </div>
        );
    }
}
