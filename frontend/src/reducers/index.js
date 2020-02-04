import {
  ADD_PROTECTED_NODE,
  DATA_LOADED,
  DELETE_PROTECTED_NODE,
  UPDATE_ALGORITHM_NAME,
  UPDATE_CONSTRAINTS,
  UPDATE_DATA_NAME,
  UPDATE_PROTECTION_EXTENT,
  UPDATE_PROTECTION_TYPE
} from "../constants/actionTypes";

const initialState = {
  dataName: "polblogs",
  algorithmName: "pagerank",
  perturbations: [],
  filteredPerturbations: [],
  nodes: {},
  edges: [],
  protectedNodes: new Set(),
  protectionType: "increased",
  protectionExtent: 0.01,
  vulnerabilityList: {}
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
    return Object.assign({}, state, action.payload, {
      filteredPerturbations: action.payload.perturbations
    });
  }

  if (action.type === ADD_PROTECTED_NODE) {
    let newProtectedNodes = new Set(state.protectedNodes);
    newProtectedNodes.add(action.payload);
    return { ...state, protectedNodes: newProtectedNodes };
  }

  if (action.type === DELETE_PROTECTED_NODE) {
    let newProtectedNodes = new Set(state.protectedNodes);
    newProtectedNodes.delete(action.payload);
    return { ...state, protectedNodes: newProtectedNodes };
  }

  if (action.type === UPDATE_PROTECTION_TYPE) {
    return Object.assign({}, state, {
      protectionType: action.payload
    });
  }

  if (action.type === UPDATE_PROTECTION_EXTENT) {
    return Object.assign({}, state, {
      protectionExtent: action.payload
    });
  }

  if (action.type === UPDATE_CONSTRAINTS) {
    return Object.assign({}, state, {
      filteredPerturbations: action.payload
    });
  }

  return state;
}

export default rootReducer;
