import {AppendMapAction} from "./AppendMapAction";
import {ChangeModeAction} from "./ChangeModeAction";
import {SelectDataAction} from "./SelectDataAction";

export type AppAction = AppendMapAction | ChangeModeAction | SelectDataAction;
