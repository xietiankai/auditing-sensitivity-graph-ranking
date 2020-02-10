import * as React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import {
  toggleGraphDisplayPNOption,
  toggleGraphMenu,
  updateActivatedTabIndex
} from "../actions";
import ReactVisRadar from "./ReactVisRadar";
import BoxPlotComponent from "./BoxPlotComponent";
import TopKDistributionView from "./TopKDistributionView";
import InfluenceGraphView from "./InfluenceGraphView";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";
import "../components/css/Detail.css";
import DetailTable from "./DetailTable";
import SettingsIcon from "@material-ui/icons/Settings";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: "100%"
    // backgroundColor: theme.palette.background.paper
  },
  cardHeader: {
    paddingLeft: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1)
  },
  tabContent: {},
  leftView: {
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(1)
  },
  rightView: {
    marginTop: theme.spacing(1)
  }
});

const mapStateToProps = state => {
  return {
    activatedTab: state.activatedTab,
    detailList: state.detailList,
    labels: state.labels
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateActivatedTabIndex: (event, value) =>
      dispatch(updateActivatedTabIndex(value)),
    toggleGraphMenuOpen: (event, removedID) =>
      dispatch(toggleGraphMenu(removedID, event.currentTarget)),
    toggleGraphMenuClose: (event, removedID) =>
      dispatch(toggleGraphMenu(removedID, null)),
    toggleGraphDisplayPNOption: (removedID, direction) =>
      dispatch(toggleGraphDisplayPNOption(removedID, direction))
  };
};

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
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
    let tabComponents = <Tab label="Empty" {...a11yProps(0)} />;
    let tabPanelComponents = (
      <TabPanel value={this.props.activatedTab} index={0}>
        Empty
      </TabPanel>
    );
    console.log(this.props.detailList);
    if (Object.keys(this.props.detailList).length !== 0) {
      tabComponents = Object.keys(this.props.detailList).map((item, i) => (
        <Tab label={item} {...a11yProps(i)} />
      ));
      tabPanelComponents = Object.keys(this.props.detailList).map(
        (removedID, i) => {
          console.log(this.props.detailList);
          console.log(removedID);
          return (
            <TabPanel
              value={this.props.activatedTab}
              className={this.props.classes.tabContent}
              index={i}
            >
              <Grid container>
                <Grid item md={4}>
                  <Paper className={this.props.classes.leftView}>
                    <Box className={this.props.classes.cardHeader}>
                      <Typography variant="body1">Influence View</Typography>
                    </Box>
                    <Divider />
                    <ReactVisRadar
                      removedNode={
                        this.props.detailList[removedID]["removedResults"]
                      }
                    />
                  </Paper>
                </Grid>
                <Grid item md={8}>
                  <Paper className={this.props.classes.rightView}>
                    <Box className={this.props.classes.cardHeader}>
                      <Typography variant="body1">Table View</Typography>
                    </Box>
                    <Divider />
                    <DetailTable
                      perturbation={
                        this.props.detailList[removedID]["removedResults"][
                          "remove_res"
                        ]
                      }
                    />
                  </Paper>
                </Grid>
                <Grid item md={8}>
                  <Paper className={this.props.classes.leftView}>
                    <Box
                      className={this.props.classes.cardHeader}
                      display={"flex"}
                    >
                      <Box flexGrow={1}>
                        <Typography variant="body1">
                          Influence Graph View
                        </Typography>
                      </Box>

                      <Box id={"setting-button"}>
                        <IconButton
                          aria-controls="simple-menu"
                          aria-haspopup="true"
                          onClick={event => {
                            this.props.toggleGraphMenuOpen(event, removedID);
                          }}
                        >
                          <SettingsIcon fontSize="small" />
                        </IconButton>
                        <Menu
                          id="simple-menu"
                          anchorEl={
                            this.props.detailList[removedID]["graphMenuOpen"]
                          }
                          keepMounted
                          open={Boolean(
                            this.props.detailList[removedID]["graphMenuOpen"]
                          )}
                          onClose={event => {
                            this.props.toggleGraphMenuClose(event, removedID);
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
                        </Menu>
                      </Box>
                    </Box>
                    <Divider />
                    <InfluenceGraphView
                      perturbation={
                        this.props.detailList[removedID]["removedResults"]
                      }
                      canvasHeight={556}
                      canvasWidth={820}
                      labels={this.props.labels}
                      removedID={removedID}
                    />
                  </Paper>
                </Grid>
                <Grid item md={4}>
                  <Paper className={this.props.classes.rightView}>
                    <Box className={this.props.classes.cardHeader}>
                      <Typography variant="body1">Distribution View</Typography>
                    </Box>
                    <Divider />
                    <BoxPlotComponent
                      perturbation={
                        this.props.detailList[removedID]["removedResults"][
                          "remove_res"
                        ]
                      }
                    />

                    <TopKDistributionView removedID={removedID} />
                  </Paper>
                </Grid>
              </Grid>
            </TabPanel>
          );
        }
      );
    }
    return (
      <div id="detail" className={this.props.classes.root}>
        <AppBar position="static" color="default">
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
