import {AppState} from "twxplore/gui/geo/reducers/AppState";

export const initialAppState: AppState = {
    info: {},
    loaded: false,
    blockMap: new Map(),
    ntaMap: new Map(),
    boroughMap: new Map(),
    blocks: [],
    NTAs: [],
    scope: "borough",
    parentUri: "",
    createSelection: false,
    selectionData: null,
    mode: "home"
};
