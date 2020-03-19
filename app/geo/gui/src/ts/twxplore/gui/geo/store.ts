import {applyMiddleware, createStore} from "redux";

//import window from 'global/window';
import {routerMiddleware} from "react-router-redux";
import {taskMiddleware} from "react-palm/tasks";
import createHistory from "history/createBrowserHistory";
import {rootReducer} from "./reducers/root/rootReducer";
import {initialRootState} from "./states/root/initialRootState";
import {composeWithDevTools} from "redux-devtools-extension";
import {
  ADD_MAP_FEATURES,
  AddMapFeaturesAction,
} from "./actions/map/AddMapFeaturesAction";
import {BaseAction} from "redux-actions";
import {RootState} from "./states/root/RootState";

//import {ADD_MAP_FEATURES} from "twxplore/gui/tree/actions/map/AddMapFeaturesAction";

const actionSanitizer = (action: BaseAction) =>
  action.type === ADD_MAP_FEATURES && (action as AddMapFeaturesAction).payload
    ? {...action, payload: {}}
    : action;

const composeEnhancers = (composeWithDevTools as any)({
  // Specify name here, actionsBlacklist, actionsCreators and other options if needed
  actionsBlacklist: ["@@kepler", ADD_MAP_FEATURES, ADD_MAP_FEATURES],
  actionSanitizer,
  stateSanitizer: (state: RootState) => (state.app ? {...state} : state),
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
