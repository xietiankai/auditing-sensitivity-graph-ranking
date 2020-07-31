import {
  ADD_PROTECTED_NODE,
  ADD_TOP_K_QUERY,
  APPEND_DETAIL_LIST,
  DATA_LOADED,
  DELETE_PROTECTED_NODE,
  LOADING_DATA,
  SNACKBAR_CLOSE,
  TOGGLE_GRAPH_MENU_BUTTON,
  TOGGLE_SHOW_NEGATIVE,
  TOGGLE_SHOW_POSITIVE,
  UPDATE_ACTIVATED_TAB_INDEX,
  UPDATE_ALGORITHM_NAME,
  UPDATE_CONSTRAINTS,
  UPDATE_DATA_NAME,
  UPDATE_K,
  UPDATE_LEVEL_BOUND,
  UPDATE_PROTECTION_EXTENT,
  UPDATE_PROTECTION_TYPE
} from "../constants/actionTypes";

const initialState = {
    dataName: "polblogs",
    algorithmName: "hits",
    perturbations: [],
    filteredPerturbations: [],
    nodes: {},
    edges: [],
    rules: [],
    protectedNodes: new Set(),
    protectionType: "increased",
    protectionExtent: 0.01,
    vulnerabilityList: {},
    snackbarOpen: false,
    snackbarMessage: "",
    activatedTab: 0,
    detailList: {},
    perturbationSummary: [],
    labels: {},
    labelNames: [],
    updateK: 0,
    currentK: 10,
    isLoading: true,
    loadingText: "Loading..."
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
            filteredPerturbations: action.payload.perturbations,
            isLoading: false
        });
    }

    if (action.type === LOADING_DATA) {
        return Object.assign({}, state, {
            isLoading: true
        });
    }

    if (action.type === ADD_PROTECTED_NODE) {
        let newProtectedNodes = new Set([
            ...state.protectedNodes,
            ...action.payload
        ]);
        return {...state, protectedNodes: newProtectedNodes};
    }

    if (action.type === DELETE_PROTECTED_NODE) {
        let newProtectedNodes = new Set(state.protectedNodes);
        newProtectedNodes.delete(action.payload);
        return {...state, protectedNodes: newProtectedNodes};
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
        return Object.assign({}, state, action.payload);
    }

    if (action.type === SNACKBAR_CLOSE) {
        return Object.assign({}, state, {
            snackbarOpen: false
        });
    }

    if (action.type === UPDATE_ACTIVATED_TAB_INDEX) {
        return Object.assign({}, state, {
            activatedTab: action.payload
        });
    }

    if (action.type === APPEND_DETAIL_LIST) {
        console.log("append detail list!");
        let detail = {};
        detail[action.payload["remove_id"]] = {
            removedResults: action.payload,
            topKQueryList: [10],
            graphMenuOpen: null,
            levelLowerBound: 0,
            levelUpperBound: 10,
            showPositive: true,
            showNegative: true
        };
        let newDetailList = Object.assign({}, state.detailList, detail);
        // console.log(newDetailList);
        return Object.assign({}, state, {
            detailList: newDetailList
        });
    }

    if (action.type === UPDATE_K) {
        return Object.assign({}, state, {
            currentK: action.payload
        });
    }

    if (action.type === ADD_TOP_K_QUERY) {
        let newState = Object.assign({}, state, {
            detailList: action.payload
        });
        console.log(newState);
        return Object.assign({}, state, {
            detailList: action.payload
        });
    }

    if (
        action.type === ADD_TOP_K_QUERY ||
        action.type === TOGGLE_GRAPH_MENU_BUTTON ||
        action.type === UPDATE_LEVEL_BOUND ||
        action.type === TOGGLE_SHOW_POSITIVE ||
        action.type === TOGGLE_SHOW_NEGATIVE
    ) {
        let newState = Object.assign({}, state, {
            detailList: action.payload
        });
        console.log(newState);
        return Object.assign({}, state, {
            detailList: action.payload
        });
    }

    return state;
}

export default rootReducer;
