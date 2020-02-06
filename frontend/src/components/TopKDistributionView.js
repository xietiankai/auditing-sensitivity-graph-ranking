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
import { Box, Button, Typography } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputAdornment from "@material-ui/core/InputAdornment";

const styles = theme => ({});

const mapStateToProps = state => {
  return {
    currentK: state.currentK,
    activatedTab: state.activatedTab,
    detailList: state.detailList
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateK: event => dispatch(updateK(event.target.value)),
    addTopKQuery: removedID => dispatch(addTopKQuery(removedID))
  };
};

export function TopKPieComponent(props) {
  const { k, perturbation } = props;
  console.log(perturbation);
  console.log(k);
  return <Typography>The pie component {k}</Typography>;
}

class TopKDistributionView extends React.Component {
  render() {
    let kDistributionComponent = <div />;
    if (
      this.props.removedID in this.props.detailList &&
      this.props.detailList[this.props.removedID]["topKQueryList"].length > 0
    ) {
      kDistributionComponent = this.props.detailList[this.props.removedID][
        "topKQueryList"
      ].map(k => (
        <TopKPieComponent
          k={k}
          perturbation={
            this.props.detailList[this.props.removedID]["removedResults"]
          }
        />
      ));
    }
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
            onClick={() => {
              this.props.addTopKQuery(this.props.removedID);
            }}
          >
            Query
          </Button>
        </Box>
        <Box>{kDistributionComponent}</Box>
      </Box>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(TopKDistributionView));
