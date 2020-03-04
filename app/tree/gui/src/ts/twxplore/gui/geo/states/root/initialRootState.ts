import {RootState} from "twxplore/gui/geo/states/root/RootState";
import {initialAppState} from "twxplore/gui/geo/states/app/initialAppState";

export const initialRootState: RootState = {
    keplerGl: {},
    app: initialAppState,
    routing: {location: null}
}

