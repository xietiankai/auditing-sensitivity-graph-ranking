import { DATA_LOADED, UPDATE_DATA_NAME } from "../constants/actionTypes";

const initialState = {
  data: {},
  dataName: "polblogs",
  algorithmName: "pagerank"
};

function rootReducer(state = initialState, action) {
  if (action.type === UPDATE_DATA_NAME) {
    return Object.assign({}, state, {
      dataName: action.payload
    });
  }

  if (action.type === DATA_LOADED) {
    return Object.assign({}, state, action.payload);
  }
  return state;
}

export default rootReducer;
