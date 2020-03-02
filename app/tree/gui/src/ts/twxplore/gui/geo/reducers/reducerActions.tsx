import reducers from "./reducers"
import {APP_STATE} from 'twxplore/gui/geo/reducers/reducers'
import {Real_State} from 'twxplore/gui/geo/reducers/reducers'
import {sendSelectionData, sendAppendMap, APPEND_MAP,SELECTION_DATA, ActionTypes} from 'twxplore/gui/geo/actions/ActionTypes'




//type Action = selectionDataAction | AppendToMap

const composedReducer = (state: Real_State, action: ActionTypes) => {
  switch (action.type) {
    case APPEND_MAP : {
      state.app[action.map].set(action.uri, action.uri)
      let result = state
      return {
        ...result
        }
    }
    case SELECTION_DATA : {
      const result = Object.assign({}, state)
      result.app.selectionData = action.selection_data
      return{
        ...result
      }
    }

    case 'treeHierarchy': {
      return {
        ...state,  
        treeHierarchy: action.treeHierarchy
      }
    }
  };
  return reducers(state, action);
 };

 export default composedReducer