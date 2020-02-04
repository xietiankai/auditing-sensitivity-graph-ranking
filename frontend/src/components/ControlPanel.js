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
import NativeSelect from "@material-ui/core/NativeSelect";
import {
  getData,
  updateAlgorithmName,
  updateConstraints,
  updateDataName,
  updateProtectionExtent,
  updateProtectionType
} from "../actions";
import VulnerabilityTable from "./VulnerabilityTable";
import ChipsArray from "./ChipsArray";
import Paper from "@material-ui/core/Paper";

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
  dataConfigContainer: {
    padding: theme.spacing(2)
  }
});

const mapStateToProps = state => {
  return {
    dataName: state.dataName,
    algorithmName: state.algorithmName,
    protectionType: state.protectionType,
    protectionExtent: state.protectionExtent
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
    }
  };
};

class ControlPanel extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes } = this.props;
    return (
      <Paper>
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
              variant="contained"
              color="primary"
              onClick={() => {}}
            >
              Load Data
            </Button>
          </Box>
        </Box>

        <Divider />
        <VulnerabilityTable />
        <Divider />
        <Box className={classes.constrainContainer}>
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
              <option value={0.05}>5%</option>
              <option value={0.1}>10%</option>
              <option value={0.2}>20%</option>
              <option value={0.3}>30%</option>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            onClick={this.props.updateConstraints}
          >
            Update constraints
          </Button>
        </Box>
      </Paper>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ControlPanel));
