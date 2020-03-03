import {TreeMapQuery_TreesBySelection} from 'twxplore/gui/geo/api/queries/types/TreeMapQuery'
import {Action} from 'redux-actions';

export type APPEND_MAP = 'APPEND_MAP';
export const APPEND_MAP: APPEND_MAP = 'APPEND_MAP';
export type SELECT_DATA = 'SELECT_DATA'
export const SELECT_DATA: SELECT_DATA = 'SELECT_DATA';
export type CHANGE_MODE = 'CHANGE_MODE';
export const CHANGE_MODE:CHANGE_MODE = 'CHANGE_MODE';

export interface SelectDataAction extends Action<TreeMapQuery_TreesBySelection> {
    type: SELECT_DATA
}

export interface AppendMapAction extends Action<{ map: string, uri: string }> {
    type: APPEND_MAP
}

export interface ChangeModeAction extends Action<string>{
    type: CHANGE_MODE
}

export type Action_Types = SelectDataAction | AppendMapAction | ChangeModeAction

export function sendSelectionData(data: TreeMapQuery_TreesBySelection): Action_Types {
    return {
        type: SELECT_DATA,
        payload : data
    }
}

export function sendAppendMap(a_map: string, a_uri: string): Action_Types{
    return {
        type: APPEND_MAP,
        payload: {
            map: a_map,
            uri: a_uri

        }
    }
}

export function sendChangeMode(data: string): Action_Types {
    return {
        type: CHANGE_MODE,
        payload : data
    }
}
