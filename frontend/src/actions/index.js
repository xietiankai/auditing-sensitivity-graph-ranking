import {
  ADD_PROTECTED_NODE,
  DATA_LOADED,
  DELETE_PROTECTED_NODE,
  UPDATE_ALGORITHM_NAME,
  UPDATE_DATA_NAME
} from "../constants/actionTypes";
import axios from "axios";

export function updateDataName(payload) {
  return { type: UPDATE_DATA_NAME, payload };
}

export function updateAlgorithmName(payload) {
  return { type: UPDATE_ALGORITHM_NAME, payload };
}

export function deleteProtectedNode(payload) {
  return { type: DELETE_PROTECTED_NODE, payload };
}

export function addProtectedNode(payload) {
  return { type: ADD_PROTECTED_NODE, payload };
}

export function getData() {
  return function(dispatch, getState) {
    axios
      .post("/loadData/", {
        dataName: getState().dataName,
        algorithmName: getState().algorithmName
      })
      .then(response => {
        const parsedData = JSON.parse(JSON.stringify(response.data));
        dispatch({ type: DATA_LOADED, payload: parsedData });
      });
  };
}
