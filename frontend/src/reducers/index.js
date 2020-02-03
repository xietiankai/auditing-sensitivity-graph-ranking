import {
  ADD_PROTECTED_NODE,
  DATA_LOADED,
  DELETE_PROTECTED_NODE,
  UPDATE_ALGORITHM_NAME,
  UPDATE_DATA_NAME
} from "../constants/actionTypes";

const initialState = {
  dataName: "polblogs",
  algorithmName: "pagerank",
  perturbations: [],
  nodes: {},
  edges: [],
  protectedNodes: new Set()
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

  if (action.type === ADD_PROTECTED_NODE) {
    let newProtectedNodes = new Set(state.protectedNodes);
    newProtectedNodes.add(action.payload);
    return {...state, protectedNodes: newProtectedNodes};
  }

  if (action.type === DELETE_PROTECTED_NODE) {
    let newProtectedNodes = new Set(state.protectedNodes);
    newProtectedNodes.delete(action.payload);
    return {...state, protectedNodes: newProtectedNodes};
  }

  if (action.type === DELETE_PROTECTED_NODE) {
    return state;
  }

  return state;
}

export default rootReducer;
