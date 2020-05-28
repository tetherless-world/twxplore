import {applyMiddleware, createStore} from "redux";

//import window from 'global/window';
import {routerMiddleware} from "react-router-redux";
import {taskMiddleware} from "react-palm/tasks";
import createHistory from "history/createBrowserHistory";
import {rootReducer} from "./reducers/root/rootReducer";
import {initialRootState} from "./states/root/initialRootState";
import {composeWithDevTools} from "redux-devtools-extension";
//import {ADD_MAP_FEATURES} from "./actions/map/AddMapFeaturesAction";
import {RootState} from "./states/root/RootState";

//import {ADD_MAP_FEATURES} from "twxplore/gui/tree/actions/map/AddMapFeaturesAction";

const actionSanitizer = (action: any) => {
  if (
    action.type.includes("CHANNEL") ||
    action.type.includes("CONFIG") ||
    action.type.includes("UI")
  ) {
    return {...action, oldLayer: {}};
  }
  return {
    ...action,
    payload: {},
    newConfig: action.newConfig ? action.newConfig : {},
    newVisConfig: action.newVisConfig ? action.newVisConfig : {},
  };
};

const composeEnhancers = (composeWithDevTools as any)({
  // Specify name here, actionsBlacklist, actionsCreators and other options if needed
  actionsBlacklist: ["@@kepler.gl/LAYER_HOVER", "@@kepler.gl/MOUSE_MOVE"],
  actionSanitizer,
  stateSanitizer: (state: RootState) =>
    state.app
      ? {
          ...state,
          routing: {},
          app: {
            map: {
              KeplerGlInstanceRegistered:
                state.app.map.keplerGlInstanceRegistered,
              features: {},
              typesVisibility: state.app.map.typesVisibility,
              filterCounter: state.app.map.filterCounter,
            },
          },
          keplerGl: {
            map: {
              visState: {
                filters: state.keplerGl.map.visState.filters,
                filtersToBeMerged:
                  state.keplerGl.map.visState.filtersToBeMerged,
              },
            },
          },
        }
      : state,
});

const history = createHistory();

export const middlewares = [taskMiddleware, routerMiddleware(history)];

//export const enhancers = [applyMiddleware(...middlewares)];

//const initialState = {};

// add redux devtools

export default createStore<any, any, any, any>(
  rootReducer,
  initialRootState,
  composeEnhancers(applyMiddleware(...middlewares))
);
