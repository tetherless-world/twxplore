import {BaseAction} from "redux-actions";
import {ADD_MAP_FEATURES, AddMapFeaturesAction} from "twxplore/gui/tree/actions/map/AddMapFeaturesAction";
import {MapState} from "twxplore/gui/tree/states/map/MapState";
import { CHANGE_FEATURE_STATE, ChangeFeatureStateAction } from "../../actions/map/ChangeFeatureStateAction";


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
    case CHANGE_FEATURE_STATE:
      const changeFeatureStateAction = action as ChangeFeatureStateAction;
      for (const resultFeature of result.features) {
          if (resultFeature.uri === changeFeatureStateAction.payload.uri) {
            resultFeature.state = changeFeatureStateAction.payload.state;
          }
        }
      break;
    default: {
      console.debug("mapReducer: ignoring action type " + action.type);
    }
    
  }

  return result;
}


// const addDataToMapAction: any = action;
// for (const row of addDataToMapAction.payload.datasets.data.rows) {
//   const addedFeature: MapFeature = row[0].properties;
//   for (const resultFeature of result.features) {
//     if (resultFeature.uri === addedFeature.uri) {
//       resultFeature.state = MapFeatureState.RENDERED;

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
