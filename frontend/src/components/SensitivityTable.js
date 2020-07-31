import * as React from "react";
import MaterialTable from "material-table";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/styles";
import Paper from "@material-ui/core/Paper";
import LinearProgress from "@material-ui/core/LinearProgress";
import { addProtectedNode, appendDetailList } from "../actions";
import Chip from "@material-ui/core/Chip";
import { lighten, Tooltip } from "@material-ui/core";
import { vulnerabilityBarColor } from "../styles";
import VerifiedUserOutlinedIcon from "@material-ui/icons/VerifiedUserOutlined";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import Box from "@material-ui/core/Box";
import "./css/SensitivityTable.css";

const styles = theme => ({
  root: {
    width: "100%",
    overflow: "auto"
  },
  labelDot: {
    width: 5,
    height: 5,
    borderRadius: "50%",
    backgroundColor: "black",
    display: "inline-block"
  }
});

const BorderLinearProgress = withStyles({
  root: {
    borderRadius: 2,
    height: 9,
    backgroundColor: lighten(vulnerabilityBarColor, 0.5)
  },
  bar: {
    borderRadius: 2,
    backgroundColor: vulnerabilityBarColor
  }
})(LinearProgress);

const mapStateToProps = state => {
  return {
    filteredPerturbations: state.filteredPerturbations,
    labels: state.labels,
    labelNames: state.labelNames
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addProtectedNode: nodeID => dispatch(addProtectedNode([nodeID])),
    appendDetailList: node => dispatch(appendDetailList(node))
  };
};

class SensitivityTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mouseX: null,
      mouseY: null
    };
  }

  render() {
    // console.log(this.props.filteredPerturbations);
    // console.log(this.props);
    // const labelName = Object.keys(this.props.labels)[0];
    let columns = [
      {
        title: "Rank",
        field: "rank",
        cellStyle: {
          maxWidth: 50
        },
        headerStyle: {
          maxWidth: 50
        }
      },
      {
        title: "Node Name",
        field: "remove_id",
        cellStyle: {
          maxWidth: 200
        },
        headerStyle: {
          maxWidth: 200
        }
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
            <React.Fragment>
              <Chip
                variant="outlined"
                size="small"
                label={
                  rowData["label"]["label"]
                  // this.props.labelNames[
                  //     this.props.labels[labelName][rowData["remove_id"]]["value"]
                  //     ]
                }
              />
            </React.Fragment>
          );
        },
        customSort: (a, b) => a["label"]["value"] - b["label"]["value"]
      },
      {
        title: "SI",
        field: "vul_percentile",
        cellStyle: {
          maxWidth: 100,
          minWidth: 100
        },
        headerStyle: {
          maxWidth: 100,
          minWidth: 100
        },
        render: rowData => (
          <Tooltip title={rowData.node_influence}>
            <BorderLinearProgress
              color={"secondary"}
              variant="determinate"
              value={rowData.vul_percentile * 100}
            />
          </Tooltip>
        )
      }
      // {
      //   title: "Vulnerability_P",
      //   field: "vul_p_percentile",
      //   cellStyle: {
      //     maxWidth: 100
      //   },
      //   headerStyle: {
      //     maxWidth: 100
      //   },
      //   render: rowData => (
      //     <LinearProgress
      //       variant="determinate"
      //       value={rowData.vul_p_percentile * 100}
      //     />
      //   )
      // },
      // {
      //   title: "Vulnerability_N",
      //   field: "vul_n_percentile",
      //   cellStyle: {
      //     maxWidth: 100
      //   },
      //   headerStyle: {
      //     maxWidth: 100
      //   },
      //   render: rowData => (
      //     <LinearProgress
      //       variant="determinate"
      //       value={rowData.vul_n_percentile * 100}
      //     />
      //   )
      // }
    ];

    if (this.props.filteredPerturbations.length > 0) {
      let labelColumns = [];
      Object.keys(
        this.props.filteredPerturbations[0]["label_influence"]
      ).forEach((key, i) => {
        if (i % 2 !== 0) {
          // console.log(key);
          labelColumns.push({
            title: key.slice(0, key.length - 11),
            field: "vul_percentile",
            cellStyle: {
              maxWidth: 100
            },
            headerStyle: {
              maxWidth: 100
            },
            customSort: (a, b) =>
              a["label_influence"][key] * 100 - b["label_influence"][key] * 100,
            render: rowData => (
              <React.Fragment>
                <Tooltip
                  title={
                    rowData["label_influence"][
                      Object.keys(
                        this.props.filteredPerturbations[0]["label_influence"]
                      )[i - 1]
                    ] === undefined
                      ? "Null"
                      : rowData["label_influence"][
                          Object.keys(
                            this.props.filteredPerturbations[0][
                              "label_influence"
                            ]
                          )[i - 1]
                        ]
                  }
                >
                  <BorderLinearProgress
                    variant="determinate"
                    value={rowData["label_influence"][key] * 100}
                  />
                </Tooltip>
              </React.Fragment>
            )
          });
        }
      });
      // console.log(labelColumns);
      columns = columns.concat(labelColumns);
    }
    // const openContextMenu = (event, rowData) => {
    //   this.setState({
    //     mouseX: event.clientX - 2,
    //     mouseY: event.clientY - 4,
    //     rowData: rowData
    //   });
    // };

    return (
      <Box id={"sensitivity-list"}>
        <MaterialTable
          className={this.props.classes.root}
          columns={columns}
          data={this.props.filteredPerturbations}
          // onRowClick={(event, rowData, togglePanel) => {
          //   // console.log(event.target);
          //   // event.preventDefault();
          //   openContextMenu(event, rowData);
          // }}
          components={{
            Container: props => <Paper {...props} elevation={0} />
          }}
          title={"Sensitivity Index"}
          options={{
            minBodyHeight: 450,
            maxBodyHeight: 450,
            padding: "dense",
            // showTitle: false,
            paging: false,
            // searchFieldAlignment: "left",
            searchFieldStyle: {
              minWidth: 370,
              maxHeight: 30,
              marginRight: 20
            },
            headerStyle: {
              paddingLeft: 15,
              paddingTop: 0,
              paddingBottom: 10
            },
            actionsColumnIndex: 0,
            actionsCellStyle: {
              // paddingLeft: 20
            }
          }}
          actions={[
            {
              icon: VerifiedUserOutlinedIcon,
              tooltip: "Add to protected nodes",
              onClick: (event, rowData) => {
                this.props.addProtectedNode(rowData["remove_id"]);
              }
            },
            {
              icon: CloseRoundedIcon,
              tooltip: "Diagnose the perturbation",
              onClick: (event, rowData) => {
                this.props.appendDetailList(rowData["remove_id"]);
              }
            }
          ]}
        />
      </Box>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(SensitivityTable));
