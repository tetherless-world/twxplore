import {applyMiddleware, createStore, compose} from "redux";

//import window from 'global/window';
import {routerMiddleware} from "react-router-redux";
import {taskMiddleware} from "react-palm/tasks";
import createHistory from "history/createBrowserHistory";
import {rootReducer} from "./reducers/root/rootReducer";
import {initialRootState} from "./states/root/initialRootState";
//import {ADD_MAP_FEATURES} from "twxplore/gui/tree/actions/map/AddMapFeaturesAction";

const history = createHistory();

export const middlewares = [taskMiddleware, routerMiddleware(history)];

//export const enhancers = [applyMiddleware(...middlewares)];

//const initialState = {};

// add redux devtools

const composeEnhancers =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default createStore<any, any, any, any>(
  rootReducer,
  initialRootState,
  composeEnhancers(applyMiddleware(...middlewares))
);
