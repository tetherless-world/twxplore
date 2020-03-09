import {RootState} from "./node_modules/twxplore/gui/tree/states/root/RootState";
import {initialAppState} from "./node_modules/twxplore/gui/tree/states/app/initialAppState";

export const initialRootState: RootState = {
  keplerGl: {},
  app: initialAppState,
  routing: {location: null},
};
