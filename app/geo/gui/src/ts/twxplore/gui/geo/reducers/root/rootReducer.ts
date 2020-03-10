import {combineReducers} from "redux";
import {routerReducer} from "react-router-redux";
import keplerGlReducer from "kepler.gl/reducers";
import { appReducer } from "../app/appReducer";

export const rootReducer = combineReducers({
  app: appReducer,
  keplerGl: keplerGlReducer.initialState({
    uiState: {
      currentModal: null,
    },
  }),
  routing: routerReducer,
});
