import {combineReducers} from "redux";
import {mapReducer} from "twxplore/gui/tree/reducers/map/mapReducer";

export const appReducer = combineReducers({
  map: mapReducer,
});
