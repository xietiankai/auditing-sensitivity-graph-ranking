import React from "react";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";
import {withStyles} from "@material-ui/styles";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import {Box, Paper, Typography} from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {green, red} from "@material-ui/core/colors";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Divider from "@material-ui/core/Divider";
import LinearProgress from "@material-ui/core/LinearProgress";
import axios from "axios";
import MaterialTable from "material-table";
import "./css/DetailView.css";
import "./css/SummaryView.css";
import {clusteringColors, leftPanelBackgroundColor, rightPanelBackgroundColor} from "../styles";
import Card from "@material-ui/core/Card";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import StarIcon from "@material-ui/icons/Star";
import ImpactGraphView from "./ImpactGraphView";
import RadialChart from "react-vis/es/radial-chart";
import BoxPlot from "./BoxPlot";
import {FlexibleWidthXYPlot, LineSeries, YAxis} from "react-vis";

const d3 = require("d3");

const styles = theme => ({
    cardHeader: {
        // backgroundColor: cardHeaderColor
        marginLeft: theme.spacing(2),
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1)
    },
    root: {
        width: "100%",
        backgroundColor: rightPanelBackgroundColor
    },
    textField: {
        // margin: theme.spacing(2),
    },
    inputField: {
        // marginLeft: theme.spacing(2),
        // marginRight: theme.spacing(2),
        // marginBottom: theme.spacing(2),
    },
    checkBox: {},
    dense: {
        marginTop: 19
    },
    button: {
        width: "100%"
    },
    panelContainer: {
        width: "100%",
        padding: theme.spacing(2)
    },
    searchResContainer: {
        width: "100",
        paddingTop: theme.spacing(2),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2)
    },
    gutterUpDown: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2)
    },
    red: {
        color: red[800]
    },
    green: {
        color: green[800]
    },
    selectionBox: {
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        padding: theme.spacing(0.5)
    },
    chip: {
        margin: theme.spacing(0.5)
    },
    mainContainer: {
        height: 950
    },
    summaryView: {
        marginTop: theme.spacing(2)
    },
    perturbationLog: {
        height: 500
    },
    pieChart: {
        padding: theme.spacing(3)
    },
    pieChartLabel: {
        // paddingTop: theme.spacing(4)
    },
    // poxPlotChart: {
    //   padding: theme.spacing(2),
    //   display: "inline-flex"
    // }
    removeButton: {
        marginTop: theme.spacing(1)
    },
    perturbationDetailsEmpty: {
        height: 500,
        paddingTop: 240,
        paddingLeft: 520
    },
    summaryViewEmpty: {
        height: 350,
        paddingTop: 180,
        paddingLeft: 660
    },
    perturbationPanelEmpty: {
        height: 780,
        paddingTop: 350,
        paddingLeft: 220
    },
    fuzzySearch: {
        fontSize: 9
    }
});

const useStyles1 = makeStyles(theme => ({
    root: {
        flexShrink: 0,
        marginLeft: theme.spacing(2.5)
    }
}));

// async function requestPerturbation(
//   dataBeforeAttack,
//   removalCandidates,
//   updatePerturbationChain,
//   dataName,
//   clusteringMethodName
// ) {
//   axios
//     .post("/apply_perturbation/" + dataName, {
//       perturbation: {
//         removalCandidates: [...removalCandidates],
//         dataBeforeAttack: dataBeforeAttack
//       },
//       configuration: {
//         clusteringMethodName: clusteringMethodName
//       }
//     })
//     .then(response => {
//       const temp = JSON.parse(JSON.stringify(response.data));
//       updatePerturbationChain(temp);
//     })
//     .catch(error => console.log(error));
// }

async function requestRemoval(
    removalCandidates,
    addPerturbationResult,
    dataName,
    handleUpdatePerturbationLogActivateIndex,
    rankingAlgorithm
) {
    axios
        .post("/apply_removal/" + dataName, {
            removalCandidates: [...removalCandidates],
            algorithm: rankingAlgorithm
        })
        .then(response => {
            const temp = JSON.parse(JSON.stringify(response.data));
            addPerturbationResult(temp);
            console.log(temp);
            handleUpdatePerturbationLogActivateIndex(temp["perturbation_id"]);
        })
        .catch(error => console.log(error));
}

export function ChipsArray(props) {
    const useStyles = makeStyles(styles);
    const classes = useStyles();
    const {
        removalCandidates,
        handleItemDeleted,
        addPerturbationResult,
        dataName,
        selectedNode,
        handleUpdatePerturbationLogActivateIndex,
        handlePerturbationDetailSelectedNode,
        rankingAlgorithm
    } = props;

    const handleDelete = chipToDelete => {
        console.log("Handle chip delete");
        removalCandidates.delete(chipToDelete);
        handleItemDeleted(removalCandidates, chipToDelete);
    };

    return (
        <Grid container>
            <Grid item md={12}>
                <Box
                    style={{
                        paddingTop: 10,
                        paddingBottom: 10,
                        minHeight: 70,
                        maxHeight: 70,
                        overflowY: "auto"
                    }}
                >
                    {removalCandidates.size === 0 ? (
                        <Chip
                            size="small"
                            disabled
                            key={"none-node-delete"}
                            label={"None"}
                        />
                    ) : (
                        Array.from(removalCandidates).map(data => {
                            return (
                                <Chip
                                    size="small"
                                    variant={"outlined"}
                                    key={data.node_id}
                                    label={data.node_id}
                                    onDelete={() => {
                                        handleDelete(data);
                                    }}
                                />
                            );
                        })
                    )}
                </Box>
            </Grid>
            <Grid item md={12}>
                <Button
                    className={classes.removeButton}
                    size="small"
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                        handlePerturbationDetailSelectedNode(selectedNode);
                        requestRemoval(
                            removalCandidates,
                            addPerturbationResult,
                            dataName,
                            handleUpdatePerturbationLogActivateIndex,
                            rankingAlgorithm
                        ).then();
                    }}
                >
                    Remove Selected Nodes
                </Button>
            </Grid>
        </Grid>
    );
}

class DetailView extends React.Component {
    constructor(props) {
        super(props);
        this.handleItemSelected = this.handleItemSelected.bind(this);
        this.isItemSelected = this.isItemSelected.bind(this);
        this.state = {
            perturbationLogActivateIndex: null,
            perturbationDetailSelectedNode: null
        };
    }

    handlePerturbationDetailSelectedNode(nodeID) {
        this.setState({
            perturbationDetailSelectedNode: nodeID
        });
    }

    handleDirectionRadioChange(event) {
        const {updateRightPanelDirection} = this.props;
        updateRightPanelDirection(event.target.value);
    }

    handleRankingInput(event) {
        const {updateRightPanelChangeDegree} = this.props;
        updateRightPanelChangeDegree(event.target.value);
    }

    handleSearchButtonClick() {
        const {
            attackList,
            rightPanelStates,
            updateRightPanelSearchResult
        } = this.props;
        const currentChangeDegree = rightPanelStates.fuzzySearch
            ? 0
            : rightPanelStates.changeDegree;
        const candidates = attackList[this.props.selectedNode];
        let res = [];
        for (let i = 0; i < candidates.length; i++) {
            if (rightPanelStates.direction === "increase") {
                if (
                    candidates[i]["rank_change"] >= 0 &&
                    candidates[i]["rank_change"] >= currentChangeDegree
                ) {
                    res.push(candidates[i]);
                }
            } else if (rightPanelStates.direction === "decrease") {
                if (
                    candidates[i]["rank_change"] <= 0 &&
                    Math.abs(candidates[i]["rank_change"]) >= currentChangeDegree
                ) {
                    res.push(candidates[i]);
                }
            }
        }
        updateRightPanelSearchResult(res);
    }

    // handleFuzzySearchChange() {
    //   if (this.state.fuzzySearch) {
    //     this.setState({
    //       fuzzySearch: false
    //     });
    //   } else {
    //     this.setState({
    //       fuzzySearch: true
    //     });
    //   }
    // }

    isNotZero(element) {
        return element["rank_change"] !== 0;
    }

    onSelectAllClick() {
        console.log("Please make life easier!");
    }

    isItemSelected(node) {
        const {removalCandidates} = this.props;
        return removalCandidates.has(node);
    }

    handleItemSelected(data) {
        const {
            removalCandidates,
            updateRemovalCandidates,
            updateRightPanelChangeEARC,
            rightPanelStates
        } = this.props;
        let candidates = removalCandidates;
        candidates.add(data);
        // get node belongs to ID
        // this.removeInformationDisplay(candidates, data["node_id"], this.props);
        let EARC = rightPanelStates.EARC;
        EARC += Number(data["rank_change"]);
        updateRightPanelChangeEARC(EARC);
        updateRemovalCandidates(candidates);
    }

    handleSelectionChange(rows) {
        const {updateRemovalCandidates, updateRightPanelChangeEARC} = this.props;
        // update candidates
        let EARC = 0;
        for (let item of rows) {
            EARC += Number(item["rank_change"]);
            // this.removeInformationDisplay(rows, item["node_id"], this.props);
        }
        updateRightPanelChangeEARC(EARC);
        updateRemovalCandidates(rows);
    }

    handleUpdatePerturbationLogActivateIndex(newIndex) {
        this.setState({
            perturbationLogActivateIndex: newIndex
        });
        console.log(this.state.perturbationLogActivateIndex);
    }

    handleItemDeleted(newRemovalCandidates, dataToBeDelete) {
        const {
            updateRemovalCandidates,
            rightPanelStates,
            updateRightPanelChangeEARC
        } = this.props;
        let EARC = rightPanelStates.EARC;
        EARC -= dataToBeDelete["rank_change"];
        updateRightPanelChangeEARC(EARC);
        updateRemovalCandidates(newRemovalCandidates);
    }

    render() {
        const {
            classes,
            selectedNode,
            dataBeforeAttack,
            addPerturbationResult,
            removalCandidates,
            rightPanelStates,
            updateRightPanelFuzzySearchChange,
            dataName,
            perturbationLog,
            clusteringMethodName,
            rankStatBeforeAttack,
            labels,
            rankingAlgorithm
        } = this.props;
        let targetComponent = <Chip size="small" disabled label="Null"/>;

        const handleItemSelectedHelper = data => {
            this.handleSelectionChange(data);
        };

        if (selectedNode) {
            console.log(labels[Object.keys(labels)[0]][selectedNode]);
            targetComponent = (
                <Chip
                    size="small"
                    label={selectedNode}
                    style={{
                        backgroundColor:
                            clusteringColors[
                                labels[Object.keys(labels)[0]][selectedNode]["value"]
                                ],
                        color: "white",
                        float: "right",
                        marginRight: 10
                    }}
                />
            );
        }
        let searchRes = <div/>;

        if (rightPanelStates.searchRes) {
            let sortedSearchRes = rightPanelStates.searchRes.filter(this.isNotZero);
            if (rightPanelStates.direction === "increase") {
                sortedSearchRes.sort((a, b) => b["rank_change"] - a["rank_change"]);
            } else {
                sortedSearchRes.sort((a, b) => a["rank_change"] - b["rank_change"]);
            }
            console.log(sortedSearchRes);
            let processedData = sortedSearchRes.map((d, i) => {
                let processedDataItem = d;
                // let processedDataItem = {
                //   node_id: d["node_id"],
                //   rank_change: d["rank_change"],
                //   will_break_graph: d["will_break_graph"]
                // };
                for (let key in labels) {
                    processedDataItem[key] = labels[key][d["node_id"]]["label"];
                    processedDataItem[key + "_value"] =
                        labels[key][d["node_id"]]["value"];
                }
                return processedDataItem;
            });

            let columns = [
                {
                    title: "Node Name",
                    field: "node_id",
                    cellStyle: {
                        maxWidth: 180
                    },
                    headerStyle: {
                        maxWidth: 180
                    }
                },
                {
                    title: "Ranking Change",
                    field: "rank_change",
                    disableClick: true,
                    cellStyle: {
                        maxWidth: 80
                    },
                    headerStyle: {
                        maxWidth: 80
                    }
                }
                // {
                //   title: "Break Graph",
                //   field: "will_break_graph",
                //   disableClick: true,
                //   render: rowData => {
                //     if (rowData["will_break_graph"] === "False") {
                //       return <span style={{ color: green[900] }}>False</span>;
                //     } else {
                //       return <span style={{ color: red[900] }}> True</span>;
                //     }
                //   }
                // }
            ];
            let columnsOfLabels = Object.keys(labels).map(item => ({
                title: item,
                field: item,
                render: rowData => {
                    return (
                        <Chip
                            size="small"
                            variant="outlined"
                            label={rowData[item]}
                            style={{
                                backgroundColor: clusteringColors[rowData[item + "_value"]],
                                color: "white"
                            }}
                        />
                    );
                }
            }));
            columns = columns.concat(columnsOfLabels);

            searchRes = (
                <Box style={{maxWidth: "100%"}} id={"detail-view"}>
                    <Box className={classes.cardHeader}>
                        <Typography>Search Results</Typography>
                    </Box>
                    <Divider/>
                    <MaterialTable
                        columns={columns}
                        style={{
                            backgroundColor: rightPanelBackgroundColor,
                            overflowY: "auto",
                            height: 565
                        }}
                        data={processedData}
                        options={{
                            paging: false,
                            padding: "dense",
                            searchFieldAlignment: "left",
                            showTitle: false,
                            searchFieldStyle: {
                                minWidth: 300,
                                maxHeight: 30
                            },

                            selection: true
                            // headerStyle: {
                            //   backgroundColor: rightPanelBackgroundColor
                            // },
                        }}
                        title={"Search Results"}
                        onSelectionChange={rows => {
                            handleItemSelectedHelper(rows);
                            console.log(rows);
                        }}
                        components={{
                            Container: props => <Paper {...props} elevation={0}/>
                        }}
                    />
                </Box>
            );
        }

        let attackSum = (
            <React.Fragment>
                <Box className={classes.cardHeader}>
                    <Typography>Perturbation Panel</Typography>
                </Box>

                <Divider/>
                <Box className={classes.perturbationPanelEmpty}>
                    <Typography color={"textSecondary"}>Empty</Typography>
                </Box>
            </React.Fragment>
        );

        if (rightPanelStates.searchRes) {
            attackSum = (
                <React.Fragment>
                    <Box className={classes.cardHeader}>
                        <Typography>Perturbation Panel</Typography>
                    </Box>

                    <Divider/>
                    <Box className={classes.panelContainer}>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                            Estimated Accumulated Ranking Changes (EARC)
                        </Typography>
                        <LinearProgress
                            variant="determinate"
                            value={
                                rightPanelStates.EARC > rightPanelStates.changeDegree
                                    ? 100
                                    : (rightPanelStates.EARC / rightPanelStates.changeDegree) *
                                    100
                            }
                        />
                        <Typography variant="body2" color="textSecondary">
                            Nodes to remove
                        </Typography>
                        <ChipsArray
                            removalCandidates={removalCandidates}
                            handleItemDeleted={this.handleItemDeleted.bind(this)}
                            dataBeforeAttack={dataBeforeAttack}
                            addPerturbationResult={addPerturbationResult}
                            handleUpdatePerturbationLogActivateIndex={this.handleUpdatePerturbationLogActivateIndex.bind(
                                this
                            )}
                            dataName={dataName}
                            rankingAlgorithm={rankingAlgorithm}
                            selectedNode={selectedNode}
                            clusteringMethodName={clusteringMethodName}
                            handlePerturbationDetailSelectedNode={this.handlePerturbationDetailSelectedNode.bind(
                                this
                            )}
                        />
                    </Box>
                </React.Fragment>
            );
        }

        let perturbationLogComponent = null;

        if (perturbationLog.size !== 0) {
            perturbationLogComponent = (
                <List className={classes.perturbationLog} dense="true">
                    {Object.keys(perturbationLog).map(key => {
                        console.log(perturbationLog);
                        if (key === this.state.perturbationLogActivateIndex) {
                            console.log(
                                Array.from(
                                    removalCandidates.map(candidate => {
                                        return candidate["node_id"];
                                    })
                                ).join("")
                            );
                            return (
                                <React.Fragment>
                                    <ListItem button key={key}>
                                        <ListItemIcon>
                                            <StarIcon/>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={"Perturbation [" + key.slice(0, 7) + "]"}
                                            secondary={
                                                "[" +
                                                perturbationLog[key]["time_stamp"] +
                                                "]" +
                                                " removed " +
                                                perturbationLog[key]["removed_nodes"]
                                            }
                                        />
                                    </ListItem>
                                    <Divider/>
                                </React.Fragment>
                            );
                        } else {
                            return (
                                <React.Fragment>
                                    <ListItem
                                        button
                                        onClick={() => {
                                            this.handleUpdatePerturbationLogActivateIndex(key);
                                        }}
                                    >
                                        <ListItemText
                                            inset
                                            primary={"Perturbation [" + key.slice(0, 7) + "]"}
                                            secondary={
                                                "[" +
                                                perturbationLog[key]["time_stamp"] +
                                                "]" +
                                                " removed " +
                                                perturbationLog[key]["removed_nodes"]
                                            }
                                        />
                                    </ListItem>
                                    <Divider/>
                                </React.Fragment>
                            );
                        }
                    })}
                </List>
            );
        }

        let perturbationDetailComponent = (
            <Box className={classes.perturbationDetailsEmpty}>
                <Typography color={"textSecondary"}>Empty</Typography>
            </Box>
        );
        if (this.state.perturbationLogActivateIndex) {
            perturbationDetailComponent = (
                <ImpactGraphView
                    canvasHeight={495}
                    canvasWidth={1045}
                    labels={labels}
                    target={this.state.perturbationDetailSelectedNode}
                    dataBeforeAttack={dataBeforeAttack}
                    perturbation={
                        perturbationLog[this.state.perturbationLogActivateIndex]
                    }
                    perturbationLogActivateIndex={this.state.perturbationLogActivateIndex}
                    perturbationLogIndex={this.state.perturbationLogActivateIndex}
                />
            );
        }

        let summaryViewComponent = (
            <Box className={classes.summaryViewEmpty}>
                <Typography color={"textSecondary"}>Empty</Typography>
            </Box>
        );

        /*********************************************************************************
         * PIE CHART DATA PROCESSING STARTS
         */

        if (this.state.perturbationLogActivateIndex) {
            const top10 = rankStatBeforeAttack["top_10"];
            const top100 = rankStatBeforeAttack["top_100"];
            const top200 = rankStatBeforeAttack["top_200"];

            const top10Data = Object.keys(top10).map(key => {
                return {
                    angle: top10[key],
                    label: key,
                    subLabel: (top10[key] / 10).toFixed(2),
                    color: clusteringColors[key]
                };
            });

            const top100Data = Object.keys(top100).map(key => {
                return {
                    angle: top100[key],
                    label: key,
                    subLabel: (top100[key] / 100).toFixed(2),
                    color: clusteringColors[key]
                };
            });

            const top200Data = Object.keys(top200).map(key => {
                return {
                    angle: top200[key],
                    label: key,
                    subLabel: (top200[key] / 200).toFixed(2),
                    color: clusteringColors[key]
                };
            });

            const perturbation =
                perturbationLog[this.state.perturbationLogActivateIndex];
            console.log(perturbation);
            const perturbationTop10 = perturbation["rank_statistic"]["top_10"];
            const perturbationTop100 = perturbation["rank_statistic"]["top_100"];
            const perturbationTop200 = perturbation["rank_statistic"]["top_200"];

            const perturbationTop10Data = Object.keys(perturbationTop10).map(key => {
                return {
                    angle: perturbationTop10[key],
                    label: key,
                    subLabel: (perturbationTop10[key] / 10).toFixed(2),
                    color: clusteringColors[key]
                };
            });

            const perturbationTop100Data = Object.keys(perturbationTop100).map(
                key => {
                    return {
                        angle: perturbationTop100[key],
                        label: key,
                        subLabel: (perturbationTop100[key] / 100).toFixed(2),
                        color: clusteringColors[key]
                    };
                }
            );

            const perturbationTop200Data = Object.keys(perturbationTop200).map(
                key => {
                    return {
                        angle: perturbationTop200[key],
                        label: key,
                        subLabel: (perturbationTop200[key] / 200).toFixed(2),
                        color: clusteringColors[key]
                    };
                }
            );

            /*******************************************************************************
             *
             * BOX PLOT DATA PROCESSING START
             */
            console.log("@#$4444444444444444444444444444444444444444444444444444444");
            console.log(dataBeforeAttack);
            console.log(perturbation);
            let boxPlotData = {};
            let boxPlotDataAfter = {};
            const tempLabelHashMap = labels[Object.keys(labels)[0]];
            Object.keys(tempLabelHashMap).map(key => {
                let rankArrays = [];
                let rankArraysAfter = [];
                if (tempLabelHashMap[key]["value"] in boxPlotData) {
                    rankArrays = boxPlotData[tempLabelHashMap[key]["value"]];
                }
                if (tempLabelHashMap[key]["value"] in boxPlotDataAfter) {
                    rankArraysAfter = boxPlotDataAfter[tempLabelHashMap[key]["value"]];
                }
                if (key in dataBeforeAttack["nodes"]) {
                    rankArrays.push(dataBeforeAttack["nodes"][key]["rank"]);
                    boxPlotData[tempLabelHashMap[key]["value"]] = rankArrays;
                }
                if (key in perturbation["modified"]["nodes"]) {
                    rankArraysAfter.push(perturbation["modified"]["nodes"][key]["rank"]);
                    boxPlotDataAfter[tempLabelHashMap[key]["value"]] = rankArraysAfter;
                }
            });

            function numSort(a, b) {
                return a - b;
            }

            function getPercentile(data, percentile) {
                data.sort(numSort);
                let index = (percentile / 100) * data.length;
                let result;
                if (Math.floor(index) == index) {
                    result = (data[index - 1] + data[index]) / 2;
                } else {
                    result = data[Math.floor(index)];
                }
                return result;
            }

            let boxPlotDataUltimate = {};

            Object.keys(boxPlotData).map(key => {
                let tempArray = [];
                if (key in boxPlotDataUltimate) {
                    tempArray = boxPlotDataUltimate[key];
                }
                tempArray.push({
                    x: 0,
                    y: getPercentile(boxPlotData[key], 50),
                    yHigh: Math.max.apply(Math, boxPlotData[key]),
                    yOpen: getPercentile(boxPlotData[key], 25),
                    yClose: getPercentile(boxPlotData[key], 75),
                    yLow: Math.min.apply(Math, boxPlotData[key]),
                    color: clusteringColors[key],
                    opacity: 0.7
                });
                boxPlotDataUltimate[key] = tempArray;
            });

            Object.keys(boxPlotDataAfter).map(key => {
                let tempArray = [];
                if (key in boxPlotDataUltimate) {
                    tempArray = boxPlotDataUltimate[key];
                }
                tempArray.push({
                    x: 1,
                    y: getPercentile(boxPlotDataAfter[key], 50),
                    yHigh: Math.max.apply(Math, boxPlotDataAfter[key]),
                    yOpen: getPercentile(boxPlotDataAfter[key], 25),
                    yClose: getPercentile(boxPlotDataAfter[key], 75),
                    yLow: Math.min.apply(Math, boxPlotDataAfter[key]),
                    color: clusteringColors[key],
                    opacity: 0.7
                });
                boxPlotDataUltimate[key] = tempArray;
            });

            let boxPlotComponents = Object.keys(boxPlotDataUltimate).map(key => {
                return (
                    <Box style={{display: "inline-flex", paddingTop: 16}}>
                        <FlexibleWidthXYPlot
                            animation
                            yDomain={[800, 0]}
                            xDomain={[-1, 2]}
                            height={300}
                            width={150}
                        >
                            <YAxis/>
                            <LineSeries color="#12939A" data={boxPlotDataUltimate[key]}/>
                            <BoxPlot
                                colorType="literal"
                                opacityType="literal"
                                stroke="#79C7E3"
                                data={boxPlotDataUltimate[key]}
                            />
                        </FlexibleWidthXYPlot>
                    </Box>
                );
            });

            /******************************************************************************
             * WATCH TABLE DATA PROCESSING STARTS
             */
            let watchTableColumns = [
                {
                    title: "Node Name",
                    field: "nodeName",
                    cellStyle: {
                        maxWidth: 110
                    },
                    headerStyle: {
                        maxWidth: 110
                    }
                },

                {
                    title: "Original PR",
                    field: "originalPR",
                    cellStyle: {
                        maxWidth: 60
                    },
                    headerStyle: {
                        maxWidth: 60
                    },
                    render: rowData => {
                        return rowData.originalPR.toFixed(3) + "%";
                    }
                },
                {
                    title: "Perturbed PR",
                    field: "perturbedPR",
                    cellStyle: {
                        maxWidth: 60
                    },
                    headerStyle: {
                        maxWidth: 60
                    },
                    render: rowdata => {
                        if (rowdata.perturbedPR === "removed") {
                            return "removed";
                        } else {
                            const diff = rowdata.perturbedPR - rowdata.originalPR;
                            if (diff > 0) {
                                return (
                                    <React.Fragment>
                                        {rowdata.perturbedPR.toFixed(3) + "% "}
                                        <span style={{color: "green"}}>
                      {"(+" + diff.toFixed(3) + "%)"}
                    </span>
                                    </React.Fragment>
                                );
                            } else if (diff < 0) {
                                return (
                                    <React.Fragment>
                                        {rowdata.perturbedPR.toFixed(3) + "% "}
                                        <span style={{color: "red"}}>
                      {"( " + diff.toFixed(3) + "%)"}
                    </span>
                                    </React.Fragment>
                                );
                            } else {
                                return (
                                    <React.Fragment>
                                        {rowdata.perturbedPR.toFixed(3) + "% "}
                                        <span style={{color: "grey"}}>{"( - )"}</span>
                                    </React.Fragment>
                                );
                            }
                        }
                    }
                },
                {
                    title: "Original Rank",
                    field: "originalRank",
                    cellStyle: {
                        maxWidth: 50
                    },
                    headerStyle: {
                        maxWidth: 50
                    }
                },
                {
                    title: "Perturbed Rank",
                    field: "perturbedRank",
                    cellStyle: {
                        maxWidth: 80
                    },
                    headerStyle: {
                        maxWidth: 80
                    },
                    render: rowdata => {
                        if (rowdata.perturbedRank === "removed") {
                            return "removed";
                        } else {
                            const diff = rowdata.perturbedRank - rowdata.originalRank;
                            if (diff > 0) {
                                return (
                                    <React.Fragment>
                                        {rowdata.perturbedRank}
                                        <span style={{color: "red"}}>{"(+" + diff + ")"}</span>
                                    </React.Fragment>
                                );
                            } else if (diff < 0) {
                                return (
                                    <React.Fragment>
                                        {rowdata.perturbedRank}
                                        <span style={{color: "green"}}>{"( " + diff + ")"}</span>
                                    </React.Fragment>
                                );
                            } else {
                                return (
                                    <React.Fragment>
                                        {rowdata.perturbedRank}
                                        <span style={{color: "grey"}}>{"( - )"}</span>
                                    </React.Fragment>
                                );
                            }
                        }
                    }
                }
            ];

            let columnsOfLabels = Object.keys(labels).map(item => ({
                title: item,
                field: item,
                cellStyle: {
                    maxWidth: 140
                },
                headerStyle: {
                    maxWidth: 140
                },
                render: rowData => {
                    return (
                        <Chip
                            size="small"
                            variant="outlined"
                            label={rowData[item]}
                            style={{
                                backgroundColor: clusteringColors[rowData[item + "_value"]],
                                color: "white"
                            }}
                        />
                    );
                }
            }));
            watchTableColumns = watchTableColumns.concat(columnsOfLabels);

            const watchTableData = Object.keys(dataBeforeAttack["nodes"]).map(key => {
                const originalPR = dataBeforeAttack["nodes"][key]["rank_value"] * 100;
                let processedDataItem = {
                    nodeName: key,
                    originalPR: originalPR,
                    perturbedPR:
                        key in perturbation["modified"]["nodes"]
                            ? perturbation["modified"]["nodes"][key]["rank_value"] * 100
                            : "removed",
                    originalRank: dataBeforeAttack["nodes"][key]["rank"],
                    perturbedRank:
                        key in perturbation["modified"]["nodes"]
                            ? perturbation["modified"]["nodes"][key]["rank"]
                            : "removed"
                };
                for (let keyLabel in labels) {
                    processedDataItem[keyLabel] = labels[keyLabel][key]["label"];
                    processedDataItem[keyLabel + "_value"] =
                        labels[keyLabel][key]["value"];
                }
                return processedDataItem;
            });

            /****************************************************************************
             * SUMMARY VIEW COMPONENTS INTEGRATION STARTS
             */

            const radialChartSize = 100;
            const radialChartRadius = 35;
            const radialChartInnerRadius = 20;
            const radialChartMargin = {left: 10, right: 10, top: 10, bottom: 10};

            summaryViewComponent = (
                <Grid container>
                    <Grid item md={4}>
                        <Box className={classes.pieChart}>
                            <Grid container>
                                <Grid item md={2}>
                                    <Typography
                                        variant={"caption"}
                                        className={classes.pieChartLabel}
                                    >
                                        Top 10 (Original)
                                    </Typography>
                                </Grid>
                                <Grid item md={4}>
                                    <RadialChart
                                        data={top10Data}
                                        width={radialChartSize}
                                        height={radialChartSize}
                                        innerRadius={radialChartInnerRadius}
                                        radius={radialChartRadius}
                                        padAngle={0.04}
                                        colorType="literal"
                                        // margin={radialChartMargin}
                                        showLabels={true}
                                    />
                                </Grid>
                                <Grid item md={2}>
                                    <Typography
                                        variant={"caption"}
                                        className={classes.pieChartLabel}
                                    >
                                        Top 10 (Perturbed)
                                    </Typography>
                                </Grid>
                                <Grid item md={4}>
                                    <RadialChart
                                        data={perturbationTop10Data}
                                        width={radialChartSize}
                                        height={radialChartSize}
                                        innerRadius={radialChartInnerRadius}
                                        radius={radialChartRadius}
                                        padAngle={0.04}
                                        colorType="literal"
                                        // margin={radialChartMargin}
                                        showLabels={true}
                                    />
                                </Grid>
                                <Grid item md={2}>
                                    <Typography
                                        variant={"caption"}
                                        className={classes.pieChartLabel}
                                    >
                                        Top 100 (Original)
                                    </Typography>
                                </Grid>
                                <Grid item md={4}>
                                    <RadialChart
                                        data={top100Data}
                                        width={radialChartSize}
                                        height={radialChartSize}
                                        innerRadius={radialChartInnerRadius}
                                        radius={radialChartRadius}
                                        padAngle={0.04}
                                        colorType="literal"
                                        // margin={radialChartMargin}
                                        showLabels={true}
                                    />
                                </Grid>
                                <Grid item md={2}>
                                    <Typography
                                        variant={"caption"}
                                        className={classes.pieChartLabel}
                                    >
                                        Top 100 (Perturbed)
                                    </Typography>
                                </Grid>
                                <Grid item md={4}>
                                    <RadialChart
                                        data={perturbationTop100Data}
                                        width={radialChartSize}
                                        height={radialChartSize}
                                        innerRadius={radialChartInnerRadius}
                                        radius={radialChartRadius}
                                        padAngle={0.04}
                                        colorType="literal"
                                        // margin={radialChartMargin}
                                        showLabels={true}
                                    />
                                </Grid>
                                <Grid item md={2}>
                                    <Typography
                                        variant={"caption"}
                                        className={classes.pieChartLabel}
                                    >
                                        Top 200 (Original)
                                    </Typography>
                                </Grid>
                                <Grid item md={4}>
                                    <RadialChart
                                        data={top200Data}
                                        width={radialChartSize}
                                        height={radialChartSize}
                                        innerRadius={radialChartInnerRadius}
                                        radius={radialChartRadius}
                                        padAngle={0.04}
                                        colorType="literal"
                                        // margin={radialChartMargin}
                                        showLabels={true}
                                    />
                                </Grid>
                                <Grid item md={2}>
                                    <Typography
                                        variant={"caption"}
                                        className={classes.pieChartLabel}
                                    >
                                        Top 200 (Perturbed)
                                    </Typography>
                                </Grid>
                                <Grid item md={4}>
                                    <RadialChart
                                        data={perturbationTop200Data}
                                        width={radialChartSize}
                                        height={radialChartSize}
                                        innerRadius={radialChartInnerRadius}
                                        radius={radialChartRadius}
                                        padAngle={0.04}
                                        colorType="literal"
                                        // margin={radialChartMargin}
                                        showLabels={true}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                    <Grid item md={3}>
                        {boxPlotComponents}
                    </Grid>
                    <Grid item md={5}>
                        <Box id={"summary-view"}>
                            <MaterialTable
                                columns={watchTableColumns}
                                style={{
                                    backgroundColor: leftPanelBackgroundColor,
                                    height: 340,
                                    overflowY: "auto"
                                }}
                                data={watchTableData}
                                options={{
                                    pageSize: 4,
                                    padding: "dense",
                                    showTitle: false,
                                    paging: false,
                                    searchFieldAlignment: "left",
                                    searchFieldStyle: {
                                        minWidth: 500,
                                        maxHeight: 30
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
                                    Container: props => <Paper {...props} elevation={0}/>
                                }}
                                onRowClick={(event, rowData, togglePanel) => {
                                    this.handlePerturbationDetailSelectedNode(
                                        rowData["nodeName"]
                                    );
                                }}
                            />
                        </Box>
                    </Grid>
                </Grid>
            );
        }

        return (
            <Grid container spacing={2} className={classes.mainContainer}>
                <Grid item md={3}>
                    <Card>
                        <Box className={classes.cardHeader}>
                            <Typography variant="body1">
                                Node to be manipulated: {targetComponent}
                            </Typography>
                        </Box>
                        <Divider/>
                        <Box className={classes.panelContainer}>
                            <Grid container>
                                <Grid item md={3}>
                                    <FormControl>
                                        <InputLabel htmlFor="direction">Direction</InputLabel>
                                        <Select
                                            native
                                            value={rightPanelStates.direction}
                                            onChange={this.handleDirectionRadioChange.bind(this)}
                                            disabled={!selectedNode}
                                        >
                                            <option value="increase">Increase</option>
                                            <option value="decrease">Decrease</option>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item md={3}>
                                    <FormControl>
                                        <TextField
                                            id="standard-number"
                                            label="Ranking Changes"
                                            value={rightPanelStates.changeDegree}
                                            disabled={!selectedNode}
                                            onChange={this.handleRankingInput.bind(this)}
                                            type="number"
                                            InputLabelProps={{
                                                shrink: true
                                            }}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item md={3}>
                                    <FormControl>
                                        <FormControlLabel
                                            className={classes.fuzzySearch}
                                            control={
                                                <Checkbox
                                                    size={"small"}
                                                    disabled={!selectedNode}
                                                    checked={rightPanelStates.fuzzySearch}
                                                    onChange={updateRightPanelFuzzySearchChange}
                                                    value="checkedB"
                                                    color="secondary"
                                                />
                                            }
                                            label="Fuzzy Search"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3}>
                                    <Button
                                        className={classes.button}
                                        variant="outlined"
                                        color="primary"
                                        size="small"
                                        onClick={this.handleSearchButtonClick.bind(this)}
                                        disabled={!selectedNode}
                                    >
                                        Search Strategies
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                        <Divider/>

                        {attackSum}
                        <Divider/>
                        {searchRes}
                    </Card>
                </Grid>
                <Grid item md={9}>
                    <Grid container spacing={2}>
                        <Grid item md={9}>
                            <Card id={"perturbation-detail"}>
                                <Box className={classes.cardHeader}>
                                    <Typography variant="body1">Perturbation Details</Typography>
                                </Box>
                                <Divider/>
                                {perturbationDetailComponent}
                            </Card>
                        </Grid>
                        <Grid item md={3}>
                            <Card>
                                <Box className={classes.cardHeader}>
                                    <Typography variant="body1">Perturbation Logs</Typography>
                                </Box>
                                <Divider/>
                                {perturbationLogComponent}
                            </Card>
                        </Grid>
                    </Grid>
                    <Grid item md={12}>
                        <Card className={classes.summaryView}>
                            <Box className={classes.cardHeader}>
                                <Typography variant="body1">Summary View</Typography>
                            </Box>
                            <Divider/>
                            {summaryViewComponent}
                        </Card>
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(DetailView);
