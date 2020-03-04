import {combineReducers} from "redux";
import {mapReducer} from "twxplore/gui/geo/reducers/mapReducer";

export const appReducer = combineReducers({
  map: mapReducer
});
