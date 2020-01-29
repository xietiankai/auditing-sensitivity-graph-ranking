import React from "react";
import axios from "axios";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import TimelineIcon from "@material-ui/icons/Timeline";
import {withStyles} from "@material-ui/styles";
import {Box, CssBaseline} from "@material-ui/core";
import Tab from "@material-ui/core/Tab";
import Grid from "@material-ui/core/Grid";
import Tabs from "@material-ui/core/Tabs";
import SwipeableViews from "react-swipeable-views";
import Overview from "./Overview";
import DetailView from "./DetailView";
import LinearProgress from "@material-ui/core/LinearProgress";

const styles = theme => ({
  root: {
    display: "flex"
  },
  appBar: {},
  menuButton: {
    marginRight: theme.spacing(2)
  },
  content: {
    flexGrow: 1,
    marginTop: theme.spacing(6),
    backgroundColor: "#EDF0F2"
  },
  tabBar: {
    backgroundColor: "#D2DBE0"
  },
  tab: {
    maxWidth: 170
  },
  rootGrid: {
    padding: 0
  }
});

const TabPanel = props => {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`action-tabpanel-${index}`}
      aria-labelledby={`action-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
};

const a11yProps = index => {
  return {
    id: `action-tab-${index}`,
    "aria-controls": `action-tabpanel-${index}`
  };
};

/***
 * Switch between tabs
 * @param prevState
 * @param newPanelID
 */
const updateTab = (prevState, newPanelID) => {
  return {
    ui: {
      tabID: newPanelID
    },
    updateMessage: "switchTab"
  };
};

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ui: {
        tabID: 0,
        isLoadingData: true
      },
      stateID: "initialState",
      dataName: "website",
      rankingAlgorithm: "pagerank",
      attack: [],
      influence: [],
      summary_attacking_effect: [],
      labels: {},
      wholeMemory: {
        initialState: {
          dataset: {
            id: "initialState",
            original: { nodes: [], edges: [] },
            communities: {
              nodes: [],
              edges: []
            },

            structural_observation: {
              is_connected: false,
              median_degree: 0,
              ave_degree_per_community: 0,
              ave_triangles: 0,
              number_communities: 0
            }
          },
          previousID: "initialState", // state ID derived from the last perturbation
          visibleSize: 30, // influence bar size
          brushRange: null,
          selectedNode: null, // target node ID currently selected
          selectedClusterID: -1, // cluster ID for highlighting and graph view display
          highlightNodeID: -1, // inspect node ID from node influence view
          removalCandidates: new Set(), // removal nodes selected by user CACHE
          removedNodes: new Set(), //removed node caused by user from previous state
          goals: null,
          rightPanelStates: {
            direction: "increase",
            changeDegree: 1, // how many ranks to change
            searchRes: null,
            fuzzySearch: false,
            page: 0,
            rowsPerPage: 10,
            numSelected: 0,
            EARC: 0
          }
        }
      },
      perturbationLog: {},
      updateMessage: "launch",

    };
  }
  componentDidMount() {
    this.getData(this.state.dataName);
  }

  render() {
    const { classes } = this.props;
    const memoryElement = this.state.wholeMemory[this.state.stateID];
    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar variant="dense">
            <IconButton
              color="inherit"
              aria-label="just a logo"
              className={classes.menuButton}
              edge="start"
              onClick={() => {}}
            >
              <TimelineIcon />
            </IconButton>
            <Typography variant="h5" noWrap>
              Graph-based Ranking Vulnerability Analysis
            </Typography>
          </Toolbar>
        </AppBar>
        <main className={classes.content}>
          <Grid container>
            <Grid item md={12}>
              <AppBar position="static" className={classes.tabBar}>
                <Tabs
                  value={this.state.ui.tabID}
                  onChange={this.switchPanel}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="fullWidth"
                  aria-label="action tabs example"
                >
                  <Tab
                    label="Overview"
                    className={classes.tab}
                    {...a11yProps("overview")}
                  />
                  <Tab
                    label="Vulnerability"
                    className={classes.tab}
                    {...a11yProps("detail")}
                  />
                  {/*<Tab*/}
                  {/*  label="Other"*/}
                  {/*  className={classes.tab}*/}
                  {/*  {...a11yProps("other")}*/}
                  {/*/>*/}
                </Tabs>
              </AppBar>
              <SwipeableViews
                axis="x"
                index={this.state.ui.tabID}
                onChangeIndex={this.handleChangeIndex}
              >
                <TabPanel value={this.state.ui.tabID} index={0} dir="ltr">
                  <Overview
                    dataName={this.state.dataName}
                    rankingAlgorithm={this.state.rankingAlgorithm}
                    attack={this.state.attack}
                    dataset={memoryElement.dataset}
                    visibleSize={memoryElement.visibleSize}
                    brushRange={memoryElement.brushRange}
                    influence={this.state.influence}
                    labels={this.state.labels}
                    highlightNodeID={memoryElement.highlightNodeID}
                    selectedNode={memoryElement.selectedNode}
                    updateMessage={this.state.updateMessage}
                    summary_attacking_effect={
                      this.state.summary_attacking_effect
                    }
                    updateDatasetName={this.updateDatasetName.bind(this)}
                    updateRankingAlgorithm={this.updateRankingAlgorithm.bind(this)}
                    updateSelectNode={this.updateSelectNode.bind(this)}
                    updateDataset={this.updateDataset.bind(this)}
                    handleChangeIndex={this.handleChangeIndex.bind(this)}
                    updateHighlightNodeID={this.updateHighlightNodeID.bind(
                      this
                    )}
                  />
                </TabPanel>
                <TabPanel value={this.state.ui.tabID} index={1} dir="ltr">
                  <DetailView
                    dataName={this.state.dataName}
                    selectedNode={memoryElement.selectedNode}
                    attackList={memoryElement.dataset.attack_list}
                    dataBeforeAttack={memoryElement.dataset.original}
                    rankStatBeforeAttack={this.state.rankStat}
                    rightPanelStates={memoryElement.rightPanelStates}
                    clusteringMethodName={this.state.clusteringMethod}
                    removalCandidates={memoryElement.removalCandidates}
                    updateMessage={this.state.updateMessage}
                    labels={this.state.labels}
                    rankingAlgorithm={this.state.rankingAlgorithm}
                    clusterData={memoryElement.dataset.communities}
                    perturbationLog={this.state.perturbationLog}
                    addPerturbationResult={this.addPerturbationResult.bind(
                      this
                    )}
                    updateRemovalCandidates={this.updateRemovalCandidates.bind(
                      this
                    )}
                    updateRightPanelDirection={this.updateRightPanelDirection.bind(
                      this
                    )}
                    updateRightPanelChangeDegree={this.updateRightPanelChangeDegree.bind(
                      this
                    )}
                    updateRightPanelFuzzySearchChange={this.updateRightPanelFuzzySearchChange.bind(
                      this
                    )}
                    updateRightPanelSearchResult={this.updateRightPanelSearchResult.bind(
                      this
                    )}
                    updateRightPanelChangePage={this.updateRightPanelChangePage.bind(
                      this
                    )}
                    updateRightPanelChangeEARC={this.updateRightPanelChangeEARC.bind(
                      this
                    )}
                  />
                </TabPanel>
                {/*<TabPanel value={this.state.ui.tabID} index={2} dir="ltr">*/}
                {/*  Other*/}
                {/*</TabPanel>*/}
              </SwipeableViews>
              <Grid item md={12}>
                <LinearProgress
                  style={{
                    display: this.state.ui.isLoadingData ? "block" : "none"
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </main>
      </div>
    );
  }

  switchPanel = (event, newPanelID) => {
    this.setState(updateTab(this.state, newPanelID));
  };

  handleChangeIndex = newPanelID => {
    this.setState(updateTab(this.state, newPanelID));
  };

  getData = dataName => {
    axios
      .post("/initialize_data/" + dataName, {
        algorithm: this.state.rankingAlgorithm
      })
      .then(response => {
        const parsedData = JSON.parse(JSON.stringify(response.data));

        let wholeMemoryElement = {};
        wholeMemoryElement[parsedData["id"]] = {
          dataset: parsedData,
          previousID: parsedData["id"],
          visibleSize: 20,
          brushRange: null,
          selectedNode: null,
          selectedClusterID: -1,
          highlightNodeID: -1,

          removalCandidates: new Set(),
          removedNodes: new Set(),
          rightPanelStates: {
            direction: "increase",
            changeDegree: 1, // how many ranks to change
            searchRes: null,
            fuzzySearch: false,
            page: 0,
            rowsPerPage: 10,
            numSelected: 0,
            EARC: 0
          }
        };

        this.setState({
          stateID: parsedData["id"],
          wholeMemory: wholeMemoryElement,
          attack: parsedData["attack"],
          labels: parsedData["labels"],
          rankStat: parsedData["rank_statistic"],
          influence: parsedData["influence"],
          summary_attacking_effect: parsedData["summary_attacking_effect"],
          perturbationLog: {},
          updateMessage: "init",
          ui: {
            tabID: 0,
            isLoadingData: false
          }
        });

        console.log("load data");
        console.log(parsedData);
      })
      .catch(error => console.log(error));
  };

  updateDatasetName = dataName => {
    this.setState({
      dataName: dataName,
      updateMessage: "updateDataName"
    });
    console.log("updateDataName");
  };

  updateRankingAlgorithm = algorithm => {
    this.setState({
      rankingAlgorithm: algorithm,
      updateMessage: "updateRankingAlgorithm"
    });
    console.log("updateAlgorithm");
  };

  updateDataset = () => {
    this.setState({
      ui: {
        isLoadingData: true
      }
    });
    this.getData(this.state.dataName);
  };

  updateHighlightNodeID(nodeID) {
    let wholeMemoryElement = this.state.wholeMemory;
    wholeMemoryElement[this.state.stateID].highlightNodeID = nodeID;
    this.setState({
      wholeMemory: wholeMemoryElement,
      updateMessage: "changeHighlightNodeID"
    });
    console.log("changeHighlightNodeID");
  }

  /***
   * Detail View Functions to be cleaned up
   */

  updateRemovalCandidates(candidates) {
    let wholeMemoryElement = this.state.wholeMemory;
    wholeMemoryElement[this.state.stateID].removalCandidates = candidates;
    this.setState({
      wholeMemory: wholeMemoryElement,
      updateMessage: "updateRemovalCandidates"
    });
    console.log("updateRemovalCandidates");
  }

  // /***
  //  * After applying perturbation, the new data will be stored as a new memory block
  //  * @param receivedData
  //  */
  // updatePerturbationChain(receivedData) {
  //   let wholeMemoryElement = this.state.wholeMemory;
  //   wholeMemoryElement[receivedData["id"]] = {
  //     dataset: receivedData,
  //     previousID: this.state.stateID,
  //     visibleSize: 20,
  //     brushRange: null,
  //     selectedNode: null,
  //     selectedClusterID: -1,
  //     highlightNodeID: -1,
  //     removalCandidates: new Set(),
  //     removedNodes: new Set([
  //       ...wholeMemoryElement[this.state.stateID].removedNodes,
  //       ...wholeMemoryElement[this.state.stateID].removalCandidates
  //     ]),
  //     goals: {
  //       target: wholeMemoryElement[this.state.stateID].selectedNode,
  //       direction:
  //         wholeMemoryElement[this.state.stateID].rightPanelStates.direction,
  //       changeDegree:
  //         wholeMemoryElement[this.state.stateID].rightPanelStates.changeDegree
  //     },
  //     rightPanelStates: {
  //       direction: "increase",
  //       changeDegree: 1, // how many ranks to change
  //       searchRes: null,
  //       fuzzySearch: false,
  //       page: 0,
  //       rowsPerPage: 10,
  //       numSelected: 0,
  //       EARC: 0
  //     }
  //   };
  //
  //   this.setState({
  //     stateID: receivedData["id"],
  //     wholeMemory: wholeMemoryElement,
  //     updateMessage: "init"
  //   });
  //   console.log("updatePerturbationChain");
  // }

  addPerturbationResult(receivedData) {
    let perturbationLog = this.state.perturbationLog;
    perturbationLog[receivedData["perturbation_id"]] = receivedData;

    this.setState({
      perturbationLog: perturbationLog,
      updateMessage: "updatePerturbationLog"
    });
    console.log("updatePerturbationLog");
  }

  updateRightPanelDirection(value) {
    let wholeMemoryElement = this.state.wholeMemory;
    wholeMemoryElement[this.state.stateID].rightPanelStates.direction = value;
    this.setState({
      wholeMemory: wholeMemoryElement,
      updateMessage: "changeRightPanelStates"
    });
    console.log("changeRightPanelStates");
  }

  updateRightPanelChangeDegree(value) {
    let wholeMemoryElement = this.state.wholeMemory;
    wholeMemoryElement[
      this.state.stateID
    ].rightPanelStates.changeDegree = value;
    this.setState({
      wholeMemory: wholeMemoryElement,
      updateMessage: "changeRightPanelStates"
    });
    console.log("changeRightPanelStates");
  }

  updateRightPanelFuzzySearchChange() {
    let wholeMemoryElement = this.state.wholeMemory;
    const fuzzySearch =
      wholeMemoryElement[this.state.stateID].rightPanelStates.fuzzySearch;
    wholeMemoryElement[
      this.state.stateID
    ].rightPanelStates.fuzzySearch = !fuzzySearch;
    this.setState({
      wholeMemory: wholeMemoryElement,
      updateMessage: "changeRightPanelStates"
    });
    console.log("changeRightPanelStates");
  }

  updateRightPanelSearchResult(searchResult) {
    let wholeMemoryElement = this.state.wholeMemory;
    wholeMemoryElement[
      this.state.stateID
    ].rightPanelStates.searchRes = searchResult;
    this.setState({
      wholeMemory: wholeMemoryElement,
      updateMessage: "changeRightPanelStates"
    });
    console.log("changeRightPanelStates");
  }

  updateRightPanelChangePage(newPage) {
    let wholeMemoryElement = this.state.wholeMemory;
    wholeMemoryElement[this.state.stateID].rightPanelStates.page = newPage;
    this.setState({
      wholeMemory: wholeMemoryElement,
      updateMessage: "changeRightPanelStates"
    });
    console.log("changeRightPanelStates");
  }

  updateRightPanelChangeEARC(EARC) {
    let wholeMemoryElement = this.state.wholeMemory;
    wholeMemoryElement[this.state.stateID].rightPanelStates.EARC = EARC;
    this.setState({
      wholeMemory: wholeMemoryElement,
      updateMessage: "changeRightPanelStates"
    });
    console.log("changeRightPanelStates");
  }

  updateSelectNode(nodeID) {
    let wholeMemoryElement = this.state.wholeMemory;
    wholeMemoryElement[this.state.stateID].selectedNode = nodeID;
    this.setState({
      wholeMemory: wholeMemoryElement,
      updateMessage: "updateSelectedNode"
    });
    console.log("updateSelectedNode");
  }
}

export default withStyles(styles)(Main);
