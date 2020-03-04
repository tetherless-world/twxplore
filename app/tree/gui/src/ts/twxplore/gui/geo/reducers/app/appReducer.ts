import {combineReducers} from "redux";
import {mapReducer} from "twxplore/gui/geo/reducers/map/mapReducer";

export const appReducer = combineReducers({
  map: mapReducer
});
