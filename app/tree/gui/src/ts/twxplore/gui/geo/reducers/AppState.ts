import {TreeMapQuery_TreesBySelection} from "twxplore/gui/geo/api/queries/types/TreeMapQuery";

export interface AppState  {
    // info: any,
    // loaded: Boolean,
    blockMap: Map<String, String>,
    ntaMap: Map<String, String>,
    boroughMap: Map<String, String>,
    blocks: Array<String>[],
    NTAs: Array<String>[],
    scope: String,
    parentUri: String,
    createSelection: Boolean,
    selectionData: TreeMapQuery_TreesBySelection | null
    mode: string
}
