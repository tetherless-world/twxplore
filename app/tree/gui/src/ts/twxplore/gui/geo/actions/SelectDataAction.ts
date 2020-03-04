import {Action} from "redux-actions";
import {TreeMapQuery_TreesBySelection} from "twxplore/gui/geo/api/queries/types/TreeMapQuery";

export type SELECT_DATA = 'SELECT_DATA'
export const SELECT_DATA: SELECT_DATA = 'SELECT_DATA';

export interface SelectDataAction extends Action<TreeMapQuery_TreesBySelection> {
    type: SELECT_DATA
}

// export function sendSelectionData(data: TreeMapQuery_TreesBySelection): SelectDataAction {
//     return {
//         type: SELECT_DATA,
//         payload : data
//     }
// }
