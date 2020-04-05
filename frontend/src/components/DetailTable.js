import * as React from "react";
import MaterialTable from "material-table";
import {leftPanelBackgroundColor, textGreen, textRed} from "../styles";
import {Box, Paper} from "@material-ui/core";
import Chip from "@material-ui/core/Chip";
import {updateDataName} from "../actions";
import {connect} from "react-redux";
import {withStyles} from "@material-ui/styles";
import "../components/css/DetailTable.css";

const styles = theme => ({
  root: { overflow: "auto" }
});

const mapStateToProps = state => {
  return {
    dataName: state.dataName,
    labels: state.labels,
    nodes: state.nodes
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateDataName: event => dispatch(updateDataName(event.target.value))
  };
};

class DetailTable extends React.Component {
  render() {
    const labelName = Object.keys(this.props.labels)[0];
    let watchTableColumns = [
      {
        title: "Node Name",
        field: "node_id",
        cellStyle: {
          maxWidth: 150
        },
        headerStyle: {
          maxWidth: 150
        }
      },
      {
        title: "O.Ranking",
        field: "rank",
        cellStyle: {
          maxWidth: 70
        },
        headerStyle: {
          maxWidth: 70
        },
        render: rowData => this.props.nodes[rowData["node_id"]]["rank"],
        customSort: (a, b) =>
          this.props.nodes[a["node_id"]]["rank"] -
          this.props.nodes[b["node_id"]]["rank"]
      },
      {
        title: "P.Ranking",
        field: "rank",
        cellStyle: {
          maxWidth: 70
        },
        headerStyle: {
          maxWidth: 70
        }
      },
      {
        title: "Diff",
        field: "rank_change",
        cellStyle: {
          maxWidth: 70
        },
        headerStyle: {
          maxWidth: 70
        },
        render: rowData => {
          if (rowData.rank_change > 0) {
            return (
              <div style={{ color: textRed }}>
                {"+" + rowData.rank_change}
              </div>
            );
          } else if (rowData.rank_change < 0) {
            return (
              <div style={{ color: textGreen }}>
                {" "}
                {rowData.rank_change}
              </div>
            );
          } else {
            return 0;
          }
        },
        customSort: (a, b) => a.rank_change - b.rank_change
      },
      {
        title: "Label",
        field: "remove_id",
        cellStyle: {
          maxWidth: 100
        },
        headerStyle: {
          maxWidth: 100
        },
        render: rowData => {
          return (
            <Chip
              variant="outlined"
              size="small"
              label={this.props.labels[labelName][rowData["node_id"]]["label"]}
            />
          );
        },
        customSort: (a, b) =>
          this.props.labels[labelName][a["node_id"]]["value"] -
          this.props.labels[labelName][b["node_id"]]["value"]
      }
    ];

    // let columnsOfLabels = Object.keys(labels).map(item => ({
    //   title: item,
    //   field: item,
    //   cellStyle: {
    //     maxWidth: 140
    //   },
    //   headerStyle: {
    //     maxWidth: 140
    //   },
    //   render: rowData => {
    //     return (
    //       <Chip
    //         size="small"
    //         variant="outlined"
    //         label={rowData[item]}
    //         style={{
    //           backgroundColor: clusteringColors[rowData[item + "_value"]],
    //           color: "white"
    //         }}
    //       />
    //     );
    //   }
    // }));
    // watchTableColumns = watchTableColumns.concat(columnsOfLabels);

    // const watchTableData = Object.keys(this.props.nodes).map(key => {
    //   const originalPR = this.props.nodes[key]["rank_value"] * 100;
    //   let processedDataItem = {
    //     nodeName: key,
    //     originalPR: originalPR,
    //     perturbedPR:
    //       key in perturbation["modified"]["nodes"]
    //         ? perturbation["modified"]["nodes"][key]["rank_value"] * 100
    //         : "removed",
    //     originalRank: this.props.nodes[key]["rank"],
    //     perturbedRank:
    //       key in perturbation["modified"]["nodes"]
    //         ? perturbation["modified"]["nodes"][key]["rank"]
    //         : "removed"
    //   };
    //   for (let keyLabel in labels) {
    //     processedDataItem[keyLabel] = labels[keyLabel][key]["label"];
    //     processedDataItem[keyLabel + "_value"] = labels[keyLabel][key]["value"];
    //   }
    //   return processedDataItem;
    // });

    return (
      <Box id={"summary-view"}>
        <MaterialTable
          className={this.props.classes.root}
          columns={watchTableColumns}
          style={{
            backgroundColor: leftPanelBackgroundColor
          }}
          title={"Detail"}
          data={this.props.perturbation}
          options={{
            pageSize: 4,
            minBodyHeight: 660,
            maxBodyHeight: 660,
            padding: "dense",

            // showTitle: false,
            paging: false,
            // searchFieldAlignment: "left",
            searchFieldStyle: {
              minWidth: 300,
              maxHeight: 30,
              marginRight: 20
            },
            headerStyle: {
              paddingTop: 0,
              paddingBottom: 10
            },
            actionsColumnIndex: 3,
            actionsCellStyle: {
              minWidth: 100
            }
            // headerStyle: {
            //   backgroundColor: leftPanelBackgroundColor
            // }
          }}
          components={{
            Container: props => <Paper {...props} elevation={0} />
          }}
        />
      </Box>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(DetailTable));
