import * as React from "react";
import MaterialTable from "material-table";
import { leftPanelBackgroundColor, textGreen, textRed } from "../styles";
import { Box, Paper } from "@material-ui/core";
import Chip from "@material-ui/core/Chip";
import { updateDataName } from "../actions";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/styles";
import "../components/css/DetailTable.css";

const styles = theme => ({
  root: {
    width: "100%",
    overflow: "auto"
  }
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
          maxWidth: 165
        },
        headerStyle: {
          maxWidth: 165
        }
      },
      {
        title: "O.Rank",
        field: "rank",
        cellStyle: {
          maxWidth: 60
        },
        headerStyle: {
          maxWidth: 60
        },
        render: rowData => this.props.nodes[rowData["node_id"]]["rank"],
        customSort: (a, b) =>
          this.props.nodes[a["node_id"]]["rank"] -
          this.props.nodes[b["node_id"]]["rank"]
      },
      {
        title: "C.Rank",
        field: "rank",
        cellStyle: {
          maxWidth: 60
        },
        headerStyle: {
          maxWidth: 60
        }
      },
      {
        title: "Diff",
        field: "rank_change",
        cellStyle: {
          maxWidth: 60
        },
        headerStyle: {
          maxWidth: 60
        },
        render: rowData => {
          if (rowData.rank_change > 0) {
            return (
              <div style={{ color: textRed }}>{"+" + rowData.rank_change}</div>
            );
          } else if (rowData.rank_change < 0) {
            return (
              <div style={{ color: textGreen }}> {rowData.rank_change}</div>
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
            minBodyHeight: 408,
            maxBodyHeight: 408,
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
