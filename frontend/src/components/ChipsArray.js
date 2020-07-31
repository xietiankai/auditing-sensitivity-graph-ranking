import * as React from "react";
import Chip from "@material-ui/core/Chip";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/styles";
import { deleteProtectedNode } from "../actions";
import { Box } from "@material-ui/core";

const styles = theme => ({
  chipsContainer: {
    // paddingTop: theme.spacing(2),
    // paddingBottom: theme.spacing(2),
    padding: theme.spacing(1),
    height: 149,
    marginRight: theme.spacing(2),
    overflow: "auto",
    border: "1px solid #e0e0e0"
  }
});

const mapStateToProps = state => {
  return { protectedNodes: state.protectedNodes };
};

const mapDispatchToProps = dispatch => {
  return {
    deleteProtectedNode: nodeID => dispatch(deleteProtectedNode(nodeID))
  };
};

class ChipsArray extends React.Component {
  render() {
    let chipsArray = <Chip size="small" key={"none"} label={"None"} disabled />;
    if (this.props.protectedNodes.size !== 0) {
      chipsArray = Array.from(this.props.protectedNodes).map(nodeID => {
        return (
          <Chip
            size="small"
            key={nodeID}
            label={nodeID}
            onDelete={() => {
              this.props.deleteProtectedNode(nodeID);
            }}
          />
        );
      });
    }

    return (
      <Box className={this.props.classes.chipsContainer}>{chipsArray}</Box>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ChipsArray));
