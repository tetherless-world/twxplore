import reducers from "./reducers"
import {APP_STATE, initialAppState} from 'twxplore/gui/geo/reducers/reducers'
import {APPEND_MAP,SELECTION_DATA, Action_Types} from 'twxplore/gui/geo/actions/Actions'
import {handleActions} from 'redux-actions';
import {ActionTypes} from 'kepler.gl/actions';
import keplerGlReducer from 'kepler.gl/reducers';
import {Action} from import { handleActions } from 'redux-actions';





//type Action = selectionDataAction | AppendToMap

export const composedReducer = (state: APP_STATE, action: Action_Types) => {
  switch (action.type) {
    case 'APPEND_MAP' : {
      state[action.map].set(action.uri, action.uri)
      let result = state
      return {
        ...result
        }
    }
    case 'SELECTION_DATA' : {
      const result = Object.assign({}, state)
      result.selectionData = action.selection_data
      return{
        ...result
      }     
    }
    case ActionTypes.LAYER_CLICK: {
      handleActions({
        [ActionTypes.LAYER_CLICK]: (state, action) => {
          switch(action.payload.info.picked) {
            case true: {
              var result = {}
              switch(action.payload.info.object.properties.type) {
                case "block": {
                  if(!(state.blockMap.has(action.payload.info.object.properties.uri))){
                    state.blocks.push(action.payload.info.object.properties.uri)
                }
                
                result = {
                  blocks: state.blocks,
                  createSelection: true
                }
                break;
              ``}
                case "NTA": {
                  break;
                }
                }
              return ({
                ...state,
                ...result,
                scope: action.payload.info.object.properties.child,
                parentUri: action.payload.info.object.properties.uri
              })
          }
        default: {
          return ({
            ...state
          })
        }
      }
    },
  }, initialAppState)
 }
}
}
  //return reducers(state, action);
export default composedReducer