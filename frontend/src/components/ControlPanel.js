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
import {getData, updateAlgorithmName, updateDataName} from "../actions";

const styles = theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
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
  button: {
    margin: theme.spacing(1)
  }
});

const mapStateToProps = state => {
  return { dataName: state.dataName, algorithmName: state.algorithmName };
};

const mapDispatchToProps = dispatch => {
  return {
    updateDataName: event => dispatch(updateDataName(event.target.value)),
    updateAlgorithmName: event => dispatch(updateAlgorithmName(event.target.value))
  }
};

class ControlPanel extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes } = this.props;
    return (
      <Card>
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
        <Button
          className={classes.button}
          variant="contained"
          color="secondary"
          onClick={() => {}}
        >
          Load Dataset
        </Button>
      </Card>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ControlPanel));
