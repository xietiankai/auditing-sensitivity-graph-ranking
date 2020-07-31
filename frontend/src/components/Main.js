import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import TimelineIcon from "@material-ui/icons/Timeline";
import { withStyles } from "@material-ui/styles";
import { Box, CssBaseline } from "@material-ui/core";
import { connect } from "react-redux";
import Grid from "@material-ui/core/Grid";
import LoadingOverlay from "react-loading-overlay";
import ControlPanel from "./ControlPanel";
import { getData } from "../actions";
import { css } from "@emotion/core";
import Detail from "./Detail";
import { backGroundColor } from "../styles";
import "./css/Main.css";
import { RingLoader } from "react-spinners";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  appBar: {},
  menuButton: {
    marginRight: theme.spacing(2)
  },
  content: {
    width: "100%",
    flexGrow: 1,
    marginTop: theme.spacing(6),
    backgroundColor: backGroundColor
  },
  tabBar: {
    backgroundColor: backGroundColor
  },
  tab: {
    maxWidth: 170
  },
  rootGrid: {
    padding: 0
  },
  controlPanel: {
    margin: theme.spacing(1)
  },
  detail: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  loader: {
    // zIndex: 10000
  }
});

const mapStateToProps = state => {
  return {
    isLoading: state.isLoading,
    loadingText: state.loadingText
  };
};

class Main extends React.Component {
  componentDidMount() {
    this.props.getData();
  }

  render() {
    const { classes } = this.props;
    return (
      <LoadingOverlay
        active={this.props.isLoading}
        spinner={
          <RingLoader
            css={css`
              display: block;
              margin-bottom: 10;
              border-color: red;
            `}
            size={60}
            color={"#ffffff"}
          />
        }
        text={this.props.loadingText}
        className={this.props.classes.loader}
      >
        <div className={classes.root}>
          <CssBaseline />
          <AppBar position="fixed" className={classes.appBar} elevation={0}>
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
              <Typography variant="h1" noWrap>
                Graph-based Ranking Sensitivity Analysis
              </Typography>
            </Toolbar>
          </AppBar>
          <main className={classes.content}>
            <Grid container>
              <Grid item xs={4}>
                <Box className={classes.controlPanel}>
                  <ControlPanel getData={this.props.getData} />
                </Box>
              </Grid>
              <Grid item xs={8}>
                <Box className={classes.detail}>
                  <Detail />
                </Box>
              </Grid>
            </Grid>
          </main>
        </div>
      </LoadingOverlay>
    );
  }
}

export default connect(mapStateToProps, { getData })(withStyles(styles)(Main));
