import {RouterState} from "react-router-redux";
import {AppState} from "../app/AppState";

export interface RootState {
  app: AppState;
  keplerGl: any;
  routing: RouterState;
}
