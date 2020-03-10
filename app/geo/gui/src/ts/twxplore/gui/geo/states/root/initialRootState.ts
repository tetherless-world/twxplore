import { initialAppState } from "../app/initialAppState";
import { RootState } from "./RootState";


export const initialRootState: RootState = {
  keplerGl: {},
  app: initialAppState,
  routing: {location: null},
};
