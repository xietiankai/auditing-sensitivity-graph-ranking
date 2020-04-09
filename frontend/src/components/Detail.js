import * as React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import {
  addProtectedNode,
  toggleGraphDisplayPNOption,
  toggleGraphMenu,
  updateActivatedTabIndex,
  updateLevelBound,
} from "../actions";
import ReactVisRadar from "./ReactVisRadar";
import BoxPlotComponent from "./BoxPlotComponent";
import TopKDistributionView from "./TopKDistributionView";
import InfluenceGraphView from "./InfluenceGraphView";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import "../components/css/Detail.css";
import DetailTable from "./DetailTable";
import SettingsIcon from "@material-ui/icons/Settings";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Slider from "@material-ui/core/Slider";
import RankingChangeOverview from "./RankingChangeOverview";
import Chip from "@material-ui/core/Chip";

const styles = (theme) => ({
  root: {
    // flexGrow: 1,
    width: "100%",
    // backgroundColor: theme.palette.background.paper
  },
  cardHeader: {
    paddingLeft: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  tabContent: {},
  leftView: {
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  rightView: {
    marginTop: theme.spacing(1),
  },
  containerPadding: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  influenceGraphViewContainer: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    height: 515,
  },
  emptyPanel: {
    paddingTop: theme.spacing(54),
    paddingLeft: theme.spacing(60),
  },
  formControlLabel: {
    display: "block",
    color: "#7c7c7c",
  },
  toolBox: {
    display: "flex",
    width: 580,
    paddingLeft: theme.spacing(2),
  },
  appBar: {
    zIndex: 100,
  },
  slider: {
    width: 135,
  },
});

const mapStateToProps = (state) => {
  return {
    activatedTab: state.activatedTab,
    detailList: state.detailList,
    labels: state.labels,
    nodes: state.nodes,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateActivatedTabIndex: (event, value) =>
      dispatch(updateActivatedTabIndex(value)),
    toggleGraphMenuOpen: (event, removedID) =>
      dispatch(toggleGraphMenu(removedID, event.currentTarget)),
    toggleGraphMenuClose: (event, removedID) =>
      dispatch(toggleGraphMenu(removedID, null)),
    toggleGraphDisplayPNOption: (removedID, direction) =>
      dispatch(toggleGraphDisplayPNOption(removedID, direction)),
    updateLevelBound: (value, removedID) =>
      dispatch(updateLevelBound(removedID, value)),
    addProtectedNode: (nodeIDsArray) =>
      dispatch(addProtectedNode(nodeIDsArray)),
  };
};

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      variant={"subtitle1"}
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

class Detail extends React.Component {
  render() {
    let tabComponents = <Tab disabled label="Null" {...a11yProps(0)} />;
    let tabPanelComponents = (
      <TabPanel value={this.props.activatedTab} index={0}>
        <Box className={this.props.classes.emptyPanel}>
          <Typography variant={"subtitle1"} color={"textSecondary"}>
            Select a node to diagnose the Sensitivity.
          </Typography>
        </Box>
      </TabPanel>
    );
    console.log(this.props.detailList);
    if (Object.keys(this.props.detailList).length !== 0) {
      tabComponents = Object.keys(this.props.detailList).map((item, i) => (
        <Tab label={item} {...a11yProps(i)} />
      ));

      tabPanelComponents = Object.keys(this.props.detailList).map(
        (removedID, i) => {
          const influenceViewLabels = this.props.detailList[removedID][
            "removedResults"
          ]["statistical"].map((item) => {
            return (
              <Box display={"flex"} style={{ width: "70%" }}>
                <Box flexGrow={1}>
                  <Typography variant={"subtitle2"} color={"textSecondary"}>
                    {item.axis}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant={"subtitle2"} color={"textSecondary"}>
                    {item.value}
                  </Typography>
                </Box>
              </Box>
            );
          });
          return (
            <TabPanel
              value={this.props.activatedTab}
              className={this.props.classes.tabContent}
              index={i}
            >
              <Grid container>
                <Grid item md={5}>
                  <Paper className={this.props.classes.leftView} elevation={0}>
                    <Box className={this.props.classes.cardHeader}>
                      <Typography variant="h6">Influence View</Typography>
                    </Box>
                    <Box className={this.props.classes.containerPadding}>
                      <Grid container>
                        <Grid item md={7}>
                          <ReactVisRadar
                            removedNode={
                              this.props.detailList[removedID]["removedResults"]
                            }
                          />
                        </Grid>
                        <Grid item md={5}>
                          <Typography variant={"body1"}>{removedID}</Typography>
                          <Box display={"flex"}>
                            <Box>
                              <Chip
                                size="small"
                                key={
                                  this.props.detailList[removedID][
                                    "removedResults"
                                  ]["rank"]
                                }
                                label={
                                  "No. " +
                                  this.props.detailList[removedID][
                                    "removedResults"
                                  ]["rank"]
                                }
                              />
                            </Box>
                            <Box>
                              <Chip
                                size="small"
                                key={
                                  this.props.detailList[removedID][
                                    "removedResults"
                                  ]["label"]["label"]
                                }
                                label={
                                  this.props.detailList[removedID][
                                    "removedResults"
                                  ]["label"]["label"]
                                }
                              />
                            </Box>
                          </Box>
                          {influenceViewLabels}
                        </Grid>
                      </Grid>
                    </Box>
                  </Paper>
                </Grid>
                <Grid item md={7}>
                  <Grid container>
                    <Grid item md={6}>
                      <Paper
                        className={this.props.classes.leftView}
                        elevation={0}
                      >
                        <Box className={this.props.classes.cardHeader}>
                          <Typography variant="h6">
                            Distribution Changes View
                          </Typography>
                        </Box>
                        <BoxPlotComponent
                          perturbation={
                            this.props.detailList[removedID]["removedResults"][
                              "remove_res"
                            ]
                          }
                        />
                      </Paper>
                    </Grid>
                    <Grid item md={6}>
                      <Paper
                        className={this.props.classes.rightView}
                        elevation={0}
                      >
                        <Box className={this.props.classes.cardHeader}>
                          <Typography variant="h6">
                            Top-k Distribution View
                          </Typography>
                        </Box>
                        <TopKDistributionView removedID={removedID} />
                      </Paper>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item md={12}>
                  <Grid container>
                    <Grid item md={7}>
                      <Grid container>
                        <Grid item md={12}>
                          <Paper
                            className={this.props.classes.leftView}
                            elevation={0}
                          >
                            <Box className={this.props.classes.cardHeader}>
                              <Typography variant="h6">
                                Ranking Change Distribution View
                              </Typography>
                            </Box>
                            <RankingChangeOverview
                              removeRes={
                                this.props.detailList[removedID][
                                  "removedResults"
                                ]["remove_res"]
                              }
                              originalRanking={this.props.nodes}
                              labels={this.props.labels}
                            />
                          </Paper>
                        </Grid>
                        <Grid item md={12}>
                          <Paper
                            className={this.props.classes.leftView}
                            elevation={0}
                          >
                            <Box
                              className={this.props.classes.cardHeader}
                              display={"flex"}
                            >
                              <Box flexGrow={1}>
                                <Typography variant="h6">
                                  Influence Graph View
                                </Typography>
                              </Box>

                              <Box id={"setting-button"}>
                                <IconButton
                                  aria-controls="simple-menu"
                                  aria-haspopup="true"
                                  onClick={(event) => {
                                    this.props.toggleGraphMenuOpen(
                                      event,
                                      removedID
                                    );
                                  }}
                                >
                                  <SettingsIcon fontSize="small" />
                                </IconButton>
                                <Menu
                                  id="simple-menu"
                                  anchorEl={
                                    this.props.detailList[removedID][
                                      "graphMenuOpen"
                                    ]
                                  }
                                  keepMounted
                                  open={Boolean(
                                    this.props.detailList[removedID][
                                      "graphMenuOpen"
                                    ]
                                  )}
                                  onClose={(event) => {
                                    this.props.toggleGraphMenuClose(
                                      event,
                                      removedID
                                    );
                                  }}
                                >
                                  <MenuItem>
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={
                                            this.props.detailList[removedID][
                                              "showPositive"
                                            ]
                                          }
                                          onChange={() => {
                                            this.props.toggleGraphDisplayPNOption(
                                              removedID,
                                              "positive"
                                            );
                                          }}
                                          value="show positive"
                                          color="primary"
                                        />
                                      }
                                      label="show positive"
                                    />
                                  </MenuItem>
                                  <MenuItem>
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={
                                            this.props.detailList[removedID][
                                              "showNegative"
                                            ]
                                          }
                                          onChange={() => {
                                            this.props.toggleGraphDisplayPNOption(
                                              removedID,
                                              "negative"
                                            );
                                          }}
                                          value="show negative"
                                          color="primary"
                                        />
                                      }
                                      label="show negative"
                                    />
                                  </MenuItem>
                                  <MenuItem>
                                    <Slider
                                      min={1}
                                      max={10}
                                      step={1}
                                      color={"secondary"}
                                      value={[
                                        this.props.detailList[removedID][
                                          "levelLowerBound"
                                        ],
                                        this.props.detailList[removedID][
                                          "levelUpperBound"
                                        ],
                                      ]}
                                      onChange={(event, value) => {
                                        console.log(value);
                                        this.props.updateLevelBound(
                                          value,
                                          removedID
                                        );
                                      }}
                                      valueLabelDisplay="auto"
                                      aria-labelledby="range-slider"
                                      getAriaValueText={(value) => {
                                        return `level ${value}`;
                                      }}
                                    />
                                  </MenuItem>
                                </Menu>
                              </Box>
                            </Box>
                            <Box
                              id={"influence-graph-view"}
                              className={
                                this.props.classes.influenceGraphViewContainer
                              }
                              position="relative"
                            >
                              <Box position="absolute" zIndex="modal">
                                <InfluenceGraphView
                                  perturbation={
                                    this.props.detailList[removedID][
                                      "removedResults"
                                    ]
                                  }
                                  canvasHeight={510}
                                  canvasWidth={690}
                                  labels={this.props.labels}
                                  removedID={removedID}
                                  addProtectedNodes={
                                    this.props.addProtectedNode
                                  }
                                />
                              </Box>
                              <Box
                                position="absolute"
                                zIndex="tooltip"
                                top="90%"
                                right="2%"
                              >
                                <Paper
                                  variant="outlined"
                                  className={this.props.classes.toolBox}
                                >
                                  <Box>
                                    <FormControlLabel
                                      className={
                                        this.props.classes.formControlLabel
                                      }
                                      control={
                                        <Checkbox
                                          checked={
                                            this.props.detailList[removedID][
                                              "showPositive"
                                            ]
                                          }
                                          onChange={() => {
                                            this.props.toggleGraphDisplayPNOption(
                                              removedID,
                                              "positive"
                                            );
                                          }}
                                          value="show positive"
                                          color="secondary"
                                        />
                                      }
                                      label="positive influence"
                                    />
                                  </Box>
                                  <Box>
                                    <FormControlLabel
                                      className={
                                        this.props.classes.formControlLabel
                                      }
                                      control={
                                        <Checkbox
                                          checked={
                                            this.props.detailList[removedID][
                                              "showNegative"
                                            ]
                                          }
                                          onChange={() => {
                                            this.props.toggleGraphDisplayPNOption(
                                              removedID,
                                              "negative"
                                            );
                                          }}
                                          value="show negative"
                                          color="secondary"
                                        />
                                      }
                                      label="negative influence"
                                    />
                                  </Box>
                                  <Box style={{ paddingTop: 8 }}>
                                    <Typography
                                      variant={"body1"}
                                      color={"textSecondary"}
                                    >
                                      Influence Distance
                                    </Typography>
                                  </Box>
                                  <Box
                                    style={{ paddingTop: 5, paddingLeft: 9 }}
                                  >
                                    <Slider
                                      className={this.props.classes.slider}
                                      min={1}
                                      max={10}
                                      step={1}
                                      value={[
                                        this.props.detailList[removedID][
                                          "levelLowerBound"
                                        ],
                                        this.props.detailList[removedID][
                                          "levelUpperBound"
                                        ],
                                      ]}
                                      onChange={(event, value) => {
                                        console.log(value);
                                        this.props.updateLevelBound(
                                          value,
                                          removedID
                                        );
                                      }}
                                      valueLabelDisplay="auto"
                                      aria-labelledby="range-slider"
                                      getAriaValueText={(value) => {
                                        return `level ${value}`;
                                      }}
                                    />
                                  </Box>
                                </Paper>
                              </Box>
                            </Box>
                          </Paper>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item md={5}>
                      <Paper
                        className={this.props.classes.rightView}
                        elevation={0}
                      >
                        <DetailTable
                          perturbation={
                            this.props.detailList[removedID]["removedResults"][
                              "remove_res"
                            ]
                          }
                        />
                      </Paper>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </TabPanel>
          );
        }
      );
    }
    return (
      <div id="detail" className={this.props.classes.root}>
        <AppBar
          position="static"
          color="default"
          elevation={0}
          className={this.props.classes.appBar}
        >
          <Tabs
            value={this.props.activatedTab}
            onChange={this.props.updateActivatedTabIndex}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example"
          >
            {tabComponents}
          </Tabs>
        </AppBar>
        {tabPanelComponents}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Detail));
