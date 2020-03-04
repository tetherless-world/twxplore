import {BaseAction} from "redux-actions";
import {ADD_MAP_FEATURES, AddMapFeaturesAction} from "twxplore/gui/tree/actions/map/AddMapFeaturesAction";
import {MapState} from "twxplore/gui/tree/states/map/MapState";
import {MapFeature} from "twxplore/gui/tree/states/map/MapFeature";
import {MapFeatureState} from "twxplore/gui/tree/states/map/MapFeatureState";

export const mapReducer = (state: MapState, action: BaseAction): MapState => {
  const result: MapState = Object.assign({}, state);

  switch (action.type) {
    case ADD_MAP_FEATURES: {
      const addMapFeaturesAction = action as AddMapFeaturesAction;
      for (const feature of addMapFeaturesAction.payload.features) {
        result.features.push(feature);
      }
      break;
    }
    case "@@kepler.gl/ADD_DATA_TO_MAP":
      const addDataToMapAction: any = action;
      for (const row of addDataToMapAction.payload.datasets.data.rows) {
        const addedFeature: MapFeature = row[0].properties;
        for (const resultFeature of result.features) {
          if (resultFeature.uri === addedFeature.uri) {
            resultFeature.state = MapFeatureState.RENDERED;
          }
        }
      }
      break;
    default: {
      console.debug("mapReducer: ignoring action type " + action.type);
    }
  }

  return result;
}


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
