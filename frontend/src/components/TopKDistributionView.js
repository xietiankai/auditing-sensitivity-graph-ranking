import * as React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/styles";
import {
  addTopKQuery,
  snackBarClose,
  updateAlgorithmName,
  updateConstraints,
  updateDataName,
  updateK,
  updateProtectionExtent,
  updateProtectionType
} from "../actions";
import { Box, Button } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputAdornment from "@material-ui/core/InputAdornment";

const styles = theme => ({});

const mapStateToProps = state => {
  return {
    currentK: state.currentK
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateK: event => dispatch(updateK(event.target.value)),
    addTopKQuery: () => dispatch(addTopKQuery())
  };
};

class TopKDistributionView extends React.Component {
  render() {
    return (
      <Box>
        <Box>
          <FormControl ariant="outlined">
            <OutlinedInput
              id="outlined-adornment-weight"
              value={this.props.currentK}
              onChange={this.props.updateK}
              startAdornment={
                <InputAdornment position="start">Top</InputAdornment>
              }
              endAdornment={
                <InputAdornment position="end">out of 100</InputAdornment>
              }
              aria-describedby="outlined-weight-helper-text"
              inputProps={{
                "aria-label": "weight"
              }}
              labelWidth={0}
            />
          </FormControl>
        </Box>
        <Box>
          <Button
            className={this.props.classes.button}
            variant="contained"
            color="primary"
            onClick={this.props.addTopKQuery}
          >
            Query
          </Button>
        </Box>
      </Box>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(TopKDistributionView));
