import * as React from "react";
import Chip from "@material-ui/core/Chip";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/styles";
import { deleteProtectedNode } from "../actions";
import { Box } from "@material-ui/core";

const styles = theme => ({});

const mapStateToProps = state => {
  return { protectedNodes: state.protectedNodes };
};

const mapDispatchToProps = dispatch => {
  return {
    deleteProtectedNode: nodeID => dispatch(deleteProtectedNode(nodeID))
  };
};

class ChipsArray extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.info(this.props.protectedNodes);
    let chipsArray = Array.from(this.props.protectedNodes).map(nodeID => {
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
    return <Box>{chipsArray}</Box>;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ChipsArray));
