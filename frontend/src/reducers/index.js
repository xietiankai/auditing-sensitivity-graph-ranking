import {
  DATA_LOADED,
  UPDATE_ALGORITHM_NAME,
  UPDATE_DATA_NAME
} from "../constants/actionTypes";

const initialState = {
  dataName: "polblogs",
  algorithmName: "pagerank",
  perturbations: [],
  nodes: {},
  edges: []
};

function rootReducer(state = initialState, action) {
  if (action.type === UPDATE_DATA_NAME) {
    return Object.assign({}, state, {
      dataName: action.payload
    });
  }

  if (action.type === UPDATE_ALGORITHM_NAME) {
    return Object.assign({}, state, {
      algorithmName: action.payload
    });
  }

  if (action.type === DATA_LOADED) {
    console.info("Data Loaded");
    console.info(action.payload);
    return Object.assign({}, state, action.payload);
  }
  return state;
}

export default rootReducer;
