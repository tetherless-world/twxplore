import {Action} from "redux-actions";

export type CHANGE_MODE = "CHANGE_MODE";
export const CHANGE_MODE: CHANGE_MODE = "CHANGE_MODE";

export interface ChangeModeAction extends Action<string> {
  type: CHANGE_MODE;
}

// export function sendChangeMode(data: string): ChangeModeAction {
//     return {
//         type: CHANGE_MODE,
//         payload : data
//     }
// }
