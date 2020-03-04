import {MapState} from "twxplore/gui/geo/reducers/MapState";

export const mapReducer = (state: MapState, action: AppAction): MapState => {
  const result: MapState = Object.assign({}, state)
  // switch (action.type) {
  //   case APPEND_MAP : {
  //     const appendMapAction = action as AppendMapAction;
  //     ((result as any)[appendMapAction.payload.map] as Map<String, String>).set(appendMapAction.payload.uri, appendMapAction.payload.uri);
  //     return result;
  //   }
  //   case SELECT_DATA: {
  //     result.selectionData = (action as SelectDataAction).payload
  //     return result;
  //   }
  //   case ActionTypes.LAYER_CLICK: {
  //     console.log("This case opened")
  //     const layerClickAction = action as any;
  //     console.log(layerClickAction)
  //     if (layerClickAction.payload.info.picked) {
  //       return result;
  //     }
  //     result.scope = layerClickAction.payload.info.object.properties.child;
  //     result.parentUri = layerClickAction.payload.info.object.properties.uri;
  //
  //     switch (layerClickAction.payload.info.object.properties.type) {
  //       case "block": {
  //         if (!(result.blockMap.has(layerClickAction.payload.info.object.properties.uri))) {
  //           result.blocks.push(layerClickAction.payload.info.object.properties.uri)
  //         }
  //         result.createSelection = true;
  //         // result = {
  //         //   blocks: state.blocks,
  //         //   createSelection: true
  //         // }
  //       }
  //         // case "NTA": {
  //         //     break;
  //         // }
  //     }
  //     return result;
  //   }
  //   case CHANGE_MODE:{
  //     result.mode = action.payload
  //     return result
  //     }
  //   default:
  //     return result;
  // }
}
