import {RouterState} from "react-router-redux";
import {AppState} from "twxplore/gui/tree/states/app/AppState";

export interface RootState {
  app: AppState;
  keplerGl: any;
  routing: RouterState;
}
