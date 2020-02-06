import * as React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { updateActivatedTabIndex } from "../actions";
import ReactVisRadar from "./ReactVisRadar";
import BoxPlotComponent from "./BoxPlotComponent";

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper
  }
});

const mapStateToProps = state => {
  return { activatedTab: state.activatedTab, detailList: state.detailList };
};

const mapDispatchToProps = dispatch => {
  return {
    updateActivatedTabIndex: (event, value) =>
      dispatch(updateActivatedTabIndex(value))
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
    if (this.props.detailList.length !== 0) {
      tabComponents = Object.keys(this.props.detailList).map((item, i) => (
        <Tab label={item} {...a11yProps(i)} />
      ));
      tabPanelComponents = Object.keys(this.props.detailList).map((item, i) => {
        return (
          <TabPanel value={this.props.activatedTab} index={i}>
            Detail about {item} !
            <ReactVisRadar removedNode={this.props.detailList[item]["removedResults"]} />
            <BoxPlotComponent perturbation={this.props.detailList[item]["removedResults"]["remove_res"]} />
          </TabPanel>
        );
      });
    }
    return (
      <div className={this.props.classes.root}>
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
