import {APP_STATE} from 'twxplore/gui/geo/reducers/reducers'
import {Action_Types, APPEND_MAP, AppendMap, SELECTION_DATA, SelectionData} from 'twxplore/gui/geo/actions/Actions'
import {ActionTypes} from 'kepler.gl/actions';


//type Action = selectionDataAction | AppendToMap

export const composedReducer = (state: APP_STATE, action: Action_Types) => {
  const result = Object.assign({}, state)
  switch (action.type) {
    case APPEND_MAP : {
      const appendMapAction = action as AppendMap;
      ((result as any)[appendMapAction.map] as Map<String, String>).set(appendMapAction.uri, appendMapAction.uri);
      return result;
    }
    case SELECTION_DATA: {
      result.selectionData = (action as SelectionData).selection_data
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
    default:
      return result;
  }
}
