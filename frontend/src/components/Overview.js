import { withStyles } from "@material-ui/styles";
import {
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  Select,
  Typography
} from "@material-ui/core";
import React from "react";
import VulnerabilityView from "./VulnerabilityView";
import Divider from "@material-ui/core/Divider";
import Box from "@material-ui/core/Box";
import GraphView from "./GraphView";

const styles = theme => ({
  cardHeader: {
    // backgroundColor: cardHeaderColor
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  button: {
    marginTop: theme.spacing(1),
    width: "100%"
  },
  formControl: {
    width: 160,
    marginRight: theme.spacing(3)
  },
  progressBar: {
    marginTop: theme.spacing(1)
  }
});

class Overview extends React.Component {
  render() {
    const {
      classes,
      dataName,
      dataset,
      attack,
      labels,
      visibleSize,
      brushRange,
      updateMessage,
      summary_attacking_effect,
      updateHighlightNodeID,
      highlightNodeID,
      selectedNode,
      updateSelectNode,
      handleChangeIndex,
      rankingAlgorithm
    } = this.props;
    return (
      <React.Fragment>
        <Grid container spacing={2}>
          <Grid item md={4}>
            <Grid container>
              <Grid item md={12}>
                <Card>
                  <Box className={classes.cardHeader}>
                    <Typography variant="body1">Data Setting</Typography>
                  </Box>
                  <Divider />
                  <CardContent>
                    <Grid container>
                      <Grid item md={8}>
                        <FormControl className={classes.formControl}>
                          <InputLabel htmlFor="data-name">Dataset</InputLabel>
                          <Select
                            native
                            value={dataName}
                            onChange={this.handleDatasetChange.bind(this)}
                            inputProps={{
                              name: "dataName",
                              id: "data-name"
                            }}
                          >
                            {/*<option value={"karate"}>Karate</option>*/}
                            {/*<option value={"enzymes_g123"}>ENZYMES_g123</option>*/}
                            <option value={"website"}>Polblogs</option>
                          </Select>
                        </FormControl>
                        <FormControl className={classes.formControl}>
                          <InputLabel htmlFor="data-name">Ranking</InputLabel>
                          <Select
                            native
                            value={rankingAlgorithm}
                            onChange={this.handleRankingAlgorithmChanges.bind(
                              this
                            )}
                            inputProps={{
                              name: "rankingAlgorithm",
                              id: "ranking-algorithm"
                            }}
                          >
                            <option value={"pagerank"}>PageRank</option>
                            <option value={"hits"}>HITS</option>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item md={4}>
                        <Button
                          className={classes.button}
                          variant="contained"
                          color="secondary"
                          onClick={this.handleLoadData.bind(this)}
                        >
                          Load Dataset
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item md={12}>
                <VulnerabilityView
                  dataset={dataset}
                  attack={attack}
                  labels={labels}
                  summary_attacking_effect={summary_attacking_effect}
                  visibleSize={visibleSize}
                  brushRange={brushRange}
                  updateMessage={updateMessage}
                  updateHighlightNodeID={updateHighlightNodeID}
                  updateSelectNode={updateSelectNode}
                  handleChangeIndex={handleChangeIndex}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={8}>
            <Card id={"graph-view"}>
              <Box className={classes.cardHeader}>
                <Typography variant="body1">Graph View</Typography>
              </Box>
              <Divider />
              <CardContent>
                <GraphView
                  canvasHeight={850}
                  canvasWidth={1200}
                  labels={labels}
                  graphData={dataset.original}
                  highlightNodeID={highlightNodeID}
                  selectedNode={selectedNode}
                  updateMessage={updateMessage}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }

  handleDatasetChange(event) {
    this.props.updateDatasetName(event.target.value);
  }

  handleRankingAlgorithmChanges(event) {
    this.props.updateRankingAlgorithm(event.target.value);
  }

  handleLoadData() {
    this.props.updateDataset();
  }
}

export default withStyles(styles)(Overview);
