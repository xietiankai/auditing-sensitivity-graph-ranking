import * as React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/styles";
import { addTopKQuery, updateK } from "../actions";
import { Box, Typography } from "@material-ui/core";
import { clusteringColors } from "../styles";
import RadialChart from "react-vis/es/radial-chart";
import Hint from "react-vis/es/plot/hint";

const styles = theme => ({
  distributionContainer: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    height: 193
  },
  formControl: {
    marginRight: theme.spacing(1)
  }
});

const mapStateToProps = state => {
  return {
    currentK: state.currentK,
    activatedTab: state.activatedTab,
    detailList: state.detailList,
    labels: state.labels,
    nodes: state.nodes,
    labelNames: state.labelNames
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateK: event => dispatch(updateK(event.target.value)),
    addTopKQuery: removedID => dispatch(addTopKQuery(removedID))
  };
};

function processingPieData(data, k, labels) {
  const labelMap = labels[Object.keys(labels)[0]];
  let perturbationStat = {};
  let labelToStringMap = {};
  data
    .sort((a, b) => a.rank - b.rank)
    .slice(0, k)
    .forEach(item => {
      const labelCat = labelMap[item["node_id"]]["value"];
      labelToStringMap[labelCat] = labelMap[item["node_id"]]["label"];
      if (labelCat in perturbationStat) {
        let count = perturbationStat[labelCat];
        count++;
        perturbationStat[labelCat] = count;
      } else {
        perturbationStat[labelCat] = 1;
      }
    });

  return Object.keys(perturbationStat).map(key => {
    return {
      angle: perturbationStat[key],
      label: labelToStringMap[key],
      subLabel: (perturbationStat[key] / k).toFixed(2),
      color: clusteringColors[key]
    };
  });
}

export function TopKPieComponent(props) {
  const { k, perturbation, labels, nodes } = props;
  const radialChartSize = 170;
  const radialChartRadius = 50;
  const radialChartInnerRadius = 35;
  const before = processingPieData(Object.values(nodes), k, labels);
  const after = processingPieData(perturbation["remove_res"], k, labels);

  const [toolTip1, setToolTip1] = React.useState(false);
  const [toolTip2, setToolTip2] = React.useState(false);

  return (
    <React.Fragment>
      <Box display="flex" justifyContent="space-around">
        <Box>
          <RadialChart
            data={before}
            width={radialChartSize}
            height={radialChartSize}
            innerRadius={radialChartInnerRadius}
            radius={radialChartRadius}
            padAngle={0.04}
            colorType="literal"
            onValueMouseOver={v => setToolTip1(v)}
            onSeriesMouseOut={v => setToolTip1(false)}
            // margin={radialChartMargin}
            showLabels={true}
            labelsStyle={{ fontSize: 10, color: "#7e7e7e" }}
            labelsRadiusMultiplier={1.5}
          >
            {toolTip1 !== false && <Hint value={toolTip1} />}
          </RadialChart>
          <Typography variant={"subtitle1"} align={"center"}>
            Original Top-{k}
          </Typography>
        </Box>
        <Box>
          <RadialChart
            data={after}
            width={radialChartSize}
            height={radialChartSize}
            innerRadius={radialChartInnerRadius}
            radius={radialChartRadius}
            padAngle={0.04}
            colorType="literal"
            onValueMouseOver={v => setToolTip2(v)}
            onSeriesMouseOut={v => setToolTip2(false)}
            // margin={radialChartMargin}
            showLabels={true}
            labelsStyle={{ fontSize: 10, color: "#7e7e7e" }}
            labelsRadiusMultiplier={1.5}
          >
            {toolTip2 !== false && <Hint value={toolTip2} />}
          </RadialChart>
          <Typography variant={"subtitle1"} align={"center"}>
            Perturbed Top-{k}
          </Typography>
        </Box>
      </Box>
    </React.Fragment>
  );
}

class TopKDistributionView extends React.Component {
  render() {
    return (
      <Box className={this.props.classes.distributionContainer}>
        <TopKPieComponent
          k={this.props.currentK}
          perturbation={
            this.props.detailList[this.props.removedID]["removedResults"]
          }
          labels={this.props.labels}
          nodes={this.props.nodes}
        />
      </Box>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(TopKDistributionView));
