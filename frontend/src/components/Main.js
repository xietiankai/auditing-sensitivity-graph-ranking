import React from "react";
import axios from "axios";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import TimelineIcon from "@material-ui/icons/Timeline";
import { withStyles } from "@material-ui/styles";
import { Box, Button, Card, CardContent, CssBaseline } from "@material-ui/core";
import { connect } from "react-redux";
import Tab from "@material-ui/core/Tab";
import Grid from "@material-ui/core/Grid";
import Tabs from "@material-ui/core/Tabs";
import SwipeableViews from "react-swipeable-views";
import Overview from "./Overview";
import DetailView from "./DetailView";
import LinearProgress from "@material-ui/core/LinearProgress";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Divider from "@material-ui/core/Divider";
import VulnerabilityView from "./VulnerabilityView";
import ControlPanel from "./ControlPanel";
import { getData, updateDataName } from "../actions";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  appBar: {},
  menuButton: {
    marginRight: theme.spacing(2)
  },
  content: {
    flexGrow: 1,
    marginTop: theme.spacing(7),
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

class Main extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.getData();
  }

  render() {
    const { classes } = this.props;
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
          <Grid container spacing={2}>
            <Grid item md={4}>
              <ControlPanel />
            </Grid>
          </Grid>
        </main>
      </div>
    );
  }
}

export default connect(null, { getData })(withStyles(styles)(Main));
