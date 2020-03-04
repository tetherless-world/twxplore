import {RouterState} from "react-router-redux";
import {AppState} from "twxplore/gui/geo/states/app/AppState";

export interface RootState {
    app: AppState
    keplerGl: any
    routing: RouterState
}
