import {APP_STATE} from 'twxplore/gui/geo/reducers/reducers'
import {
  Action_Types,
  APPEND_MAP,
  AppendMapAction,
  SELECT_DATA,
  SelectDataAction,
  CHANGE_MODE
} from 'twxplore/gui/geo/actions/Actions'
import {ActionTypes} from 'kepler.gl/actions';


//type Action = selectionDataAction | AppendToMap

export const composedReducer = (state: APP_STATE, action: Action_Types) => {
  const result = Object.assign({}, state)
  switch (action.type) {
    case APPEND_MAP : {
      const appendMapAction = action as AppendMapAction;
      ((result as any)[appendMapAction.payload.map] as Map<String, String>).set(appendMapAction.payload.uri, appendMapAction.payload.uri);
      return result;
    }
    case SELECT_DATA: {
      result.selectionData = (action as SelectDataAction).payload
      return result;
    }
    case ActionTypes.LAYER_CLICK: {
      const layerClickAction = action as any;
      if (layerClickAction.payload.info.picked) {
        return result;
      }
      result.scope = layerClickAction.payload.info.object.properties.child;
      result.parentUri = layerClickAction.payload.info.object.properties.uri;

      switch (layerClickAction.payload.info.object.properties.type) {
        case "block": {
          if (!(result.blockMap.has(layerClickAction.payload.info.object.properties.uri))) {
            result.blocks.push(layerClickAction.payload.info.object.properties.uri)
          }
          result.createSelection = true;
          // result = {
          //   blocks: state.blocks,
          //   createSelection: true
          // }
        }
          // case "NTA": {
          //     break;
          // }
      }
      return result;
    }
    case CHANGE_MODE:{
      result.mode = action.payload
      return result
      }
    default:
      return result;
  }
}
