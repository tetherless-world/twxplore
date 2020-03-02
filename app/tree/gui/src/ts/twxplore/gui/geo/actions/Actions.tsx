import { TreeMapQuery_TreesBySelection } from 'twxplore/gui/geo/api/queries/types/TreeMapQuery'
export const APPEND_MAP = 'AppendMap'
export const SELECTION_DATA = 'SelectionData'

interface SelectionData{
    type: typeof SELECTION_DATA
    selection_data: TreeMapQuery_TreesBySelection
  }
  
interface AppendMap{
    type: typeof APPEND_MAP
    map: string
    uri: string
  }

export type ActionTypes = SelectionData | AppendMap

export function sendSelectionData(data : TreeMapQuery_TreesBySelection): ActionTypes{
    return {
        type: SELECTION_DATA,
        selection_data: data
    }
}

export function sendAppendMap(a_map: string, a_uri: string): ActionTypes{
    return {
        type: APPEND_MAP,
        map: a_map,
        uri: a_uri
    }
}
