import {combineReducers} from "redux";
import {mapReducer} from "../map/mapReducer";

export const appReducer = combineReducers({
  map: mapReducer,
});
