import {initialAppState} from "twxplore/gui/geo/reducers/initialAppState";
import {RootState} from "twxplore/gui/geo/reducers/RootState";

export const initialRootState: RootState = {
    keplerGl: {},
    app: initialAppState,
    routing: {location: null}
}

