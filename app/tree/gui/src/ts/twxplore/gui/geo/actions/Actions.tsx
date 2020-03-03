import {TreeMapQuery_TreesBySelection} from 'twxplore/gui/geo/api/queries/types/TreeMapQuery'
import {Action} from 'redux-actions';
import {Real_State} from '../reducers/reducers';

export const APPEND_MAP = 'AppendMap'
export const SELECTION_DATA = 'SelectionData'
export const TEST = 'Tesht'

export interface SelectionData {
    type: typeof SELECTION_DATA
    selection_data: TreeMapQuery_TreesBySelection
}

export interface AppendMap {
    type: typeof APPEND_MAP
    map: string
    uri: String
}


export type Action_Types = SelectionData | AppendMap | Action<Real_State>

export function sendSelectionData(data: TreeMapQuery_TreesBySelection): Action_Types {
    return {
        type: SELECTION_DATA,
        selection_data: data
    }
}

export function sendAppendMap(a_map: string, a_uri: String): Action_Types{
    return {
        type: APPEND_MAP,
        map: a_map,
        uri: a_uri
    }
}
