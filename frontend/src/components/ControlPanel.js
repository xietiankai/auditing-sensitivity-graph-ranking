import * as React from "react";
import Grid from "@material-ui/core/Grid";
import { Box, Button, Card, CardContent } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/styles";
import MenuItem from "@material-ui/core/MenuItem";
import CloseIcon from "@material-ui/icons/Close";
import {
  getData,
  snackBarClose,
  toggleLoading,
  updateAlgorithmName,
  updateConstraints,
  updateDataName,
  updateProtectionExtent,
  updateProtectionType
} from "../actions";
import VulnerabilityTable from "./VulnerabilityTable";
import ChipsArray from "./ChipsArray";
import Paper from "@material-ui/core/Paper";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";

const styles = theme => ({
  formControl: {
    minWidth: 120,
    marginRight: theme.spacing(2)
  },
  cardHeader: {
    // backgroundColor: cardHeaderColor
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  select: {
    padding: theme.spacing(1)
  },
  // button: {
  //   margin: theme.spacing(1)
  // },
  constrainContainer: {
    padding: theme.spacing(2)
  },
  chipsArrayContainer: {
    height: 60,
    overflow: "auto"
  },
  dataConfigContainer: {
    padding: theme.spacing(2)
  },
  rulesContainer: {
    height: 200
  }
});

const mapStateToProps = state => {
  return {
    dataName: state.dataName,
    algorithmName: state.algorithmName,
    protectionType: state.protectionType,
    protectionExtent: state.protectionExtent,
    snackbarOpen: state.snackbarOpen,
    snackbarMessage: state.snackbarMessage,
    rules: state.rules
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateDataName: event => dispatch(updateDataName(event.target.value)),
    updateAlgorithmName: event =>
      dispatch(updateAlgorithmName(event.target.value)),
    updateProtectionType: event =>
      dispatch(updateProtectionType(event.target.value)),
    updateProtectionExtent: event =>
      dispatch(updateProtectionExtent(event.target.value)),
    updateConstraints: () => {
      dispatch(updateConstraints());
    },
    snackBarClose: () => {
      dispatch(snackBarClose());
    },
    toggleLoading: () => {
      dispatch(toggleLoading());
    }
  };
};

class ControlPanel extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes } = this.props;
    const loadDataHelper = () => {
      this.props.toggleLoading();
      this.props.getData();
    };
    let rulesComponents = (
      <Card className={classes.root} elevation={0}>
        <CardContent>
          <Typography
            className={classes.title}
            color="textSecondary"
            gutterBottom
          >
            No rules yet
          </Typography>
        </CardContent>
      </Card>
    );
    if (this.props.rules.length !== 0) {
      rulesComponents = this.props.rules.map(item => {
        return (
          <Card className={classes.root} elevation={0}>
            <CardContent>
              <Typography
                className={classes.title}
                color="textSecondary"
                gutterBottom
              >
                {item.protectedNodes}
              </Typography>
              <Typography className={classes.pos} color="textSecondary">
                {item.protectionType}
              </Typography>
              <Typography variant="body2" component="p">
                {item.protectionExtent}
              </Typography>
            </CardContent>
          </Card>
        );
      });
    }
    return (
      <Paper elevation={0}>
        <Box className={classes.dataConfigContainer} display={"flex"}>
          <Box flexGrow={1}>
            <FormControl variant="outlined" className={classes.formControl}>
              <Select
                native
                value={this.props.dataName}
                onChange={this.props.updateDataName}
                inputProps={{
                  name: "dataName",
                  id: "data-name",
                  className: classes.select
                }}
              >
                <option value={"polblogs"}>Polblogs</option>
                <option value={"reddit"}>Reddit</option>
              </Select>
            </FormControl>
            <FormControl variant="outlined" className={classes.formControl}>
              <Select
                native
                value={this.props.algorithmName}
                onChange={this.props.updateAlgorithmName}
                inputProps={{
                  name: "rankingAlgorithm",
                  id: "ranking-algorithm",
                  className: classes.select
                }}
              >
                <option value={"pagerank"}>PageRank</option>
                <option value={"hits"}>HITS</option>
              </Select>
            </FormControl>
          </Box>
          <Box>
            <Button
              className={classes.button}
              variant="outlined"
              color="primary"
              onClick={loadDataHelper}

            >
              Load Data
            </Button>
          </Box>
        </Box>

        <Divider />
        <VulnerabilityTable />
        <Divider />
        <Box className={classes.constrainContainer}>
          <Typography variant={"h6"}>Rules</Typography>
          <Box className={classes.rulesContainer}>{rulesComponents}</Box>
          <Typography variant={"h6"}>Protected Nodes</Typography>
          <ChipsArray />
          <Typography variant={"h6"}>Constraints</Typography>
          Protect selected nodes from their ranking
          <FormControl variant="outlined" className={classes.formControl}>
            <Select
              native
              value={this.props.protectionType}
              onChange={this.props.updateProtectionType}
              inputProps={{
                name: "protectType",
                id: "protect-type",
                className: classes.select
              }}
            >
              <option value={"increased"}>increased</option>
              <option value={"decreased"}>decreased</option>
            </Select>
          </FormControl>
          by
          <FormControl variant="outlined" className={classes.formControl}>
            <Select
              native
              value={this.props.protectionExtent}
              onChange={this.props.updateProtectionExtent}
              inputProps={{
                name: "protectExtent",
                id: "protect-extent",
                className: classes.select
              }}
            >
              <option value={0.01}>1%</option>
              <option value={0.02}>2%</option>
              <option value={0.03}>3%</option>
              <option value={0.05}>5%</option>
              <option value={0.1}>10%</option>
              <option value={0.2}>20%</option>
              <option value={0.3}>30%</option>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            color="primary"
            onClick={this.props.updateConstraints}
          >
            Update constraints
          </Button>
          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right"
            }}
            open={this.props.snackbarOpen}
            message={this.props.snackbarMessage}
            autoHideDuration={6000}
            onClose={this.props.snackBarClose}
            action={
              <React.Fragment>
                <IconButton
                  size="small"
                  aria-label="close"
                  color="inherit"
                  onClick={this.props.snackBarClose}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </React.Fragment>
            }
          />
        </Box>
      </Paper>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ControlPanel));
