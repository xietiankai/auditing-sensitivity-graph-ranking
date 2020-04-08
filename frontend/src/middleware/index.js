import {UPDATE_DATA_NAME} from "../constants/actionTypes";

export function doNothingMiddleware({getState, dispatch}) {
    return function (next) {
        return function (action) {
            if (action.type === UPDATE_DATA_NAME) {
                // Do something
            }
            return next(action);
        };
    };
}
