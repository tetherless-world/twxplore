import {BaseAction} from "redux-actions";

import {MapFeatureState} from "../../states/map/MapFeatureState";
import {MapFeature} from "../../states/map/MapFeature";
import {
  CHANGE_MAP_FEATURE_STATE,
  ChangeMapFeatureStateAction
} from "../../actions/map/ChangeMapFeatureStateAction";
import { ADD_MAP_FEATURES, AddMapFeaturesAction } from "../../actions/map/AddMapFeaturesAction";
import { MapState } from "../../states/map/MapState";

export const mapReducer = (state: MapState, action: BaseAction): MapState => {
  const result: MapState = Object.assign({}, state);

  switch (action.type) {
    case ADD_MAP_FEATURES: {
      const addMapFeaturesAction = action as AddMapFeaturesAction;
      for (const feature of addMapFeaturesAction.payload.features) {
        result.features.push(feature);
        console.log("added map feature " + feature.uri);
      }
      break;
    }
    case "@@kepler.gl/ADD_DATA_TO_MAP": {
      const addDataToMapAction: any = action;
      console.log(addDataToMapAction)
      for (const row of addDataToMapAction.payload.datasets.data.features) {
        const addedFeature: MapFeature = row.properties;
        for (const resultFeature of result.features) {
          if (resultFeature.uri === addedFeature.uri) {
            resultFeature.state = MapFeatureState.RENDERED;
            console.debug(
              "changed map feature " +
                resultFeature.uri +
                " to state " +
                MapFeatureState.RENDERED
            );
          }
        }
      }
      break;
    }
    case CHANGE_MAP_FEATURE_STATE: {
      const changeMapFeatureStateAction = action as ChangeMapFeatureStateAction;
      for (const actionUri of changeMapFeatureStateAction.payload.uris)
      {
        for (const resultFeature of result.features) {
          if (resultFeature.uri === actionUri) {
            resultFeature.state = changeMapFeatureStateAction.payload.state;
            console.debug(
              "changed map feature " +
                resultFeature.uri +
                " to state " +
                changeMapFeatureStateAction.payload.state
            );
          }
        }
      }
    }
    case "@@kepler.gl/REGISTER_ENTRY":
      result.keplerGlInstanceRegistered = true;
      break;

    case "@@kepler.gl/LAYER_CLICK": {
      const layerClickAction: any = action;
      for (const resultFeature of result.features) {
        if (
          resultFeature.uri ===
          layerClickAction.payload.info.object.properties.uri
        ) {
          resultFeature.state = MapFeatureState.CLICKED;
          console.debug(
            "changed map feature " +
              resultFeature.uri +
              " to state " +
              MapFeatureState.RENDERED
          );
        }
      }
      break;
    }
    default: {
      console.log("mapReducer: ignoring action type " + action.type);
    }
  }

  return result;
};
