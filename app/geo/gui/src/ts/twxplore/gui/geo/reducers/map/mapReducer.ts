import {BaseAction} from "redux-actions";

import {MapFeatureState} from "../../states/map/MapFeatureState";
import {MapFeature} from "../../states/map/MapFeature";
import {
  CHANGE_MAP_FEATURE_STATE,
  ChangeMapFeatureStateAction,
} from "../../actions/map/ChangeMapFeatureStateAction";
import {
  ADD_MAP_FEATURES,
  AddMapFeaturesAction,
} from "../../actions/map/AddMapFeaturesAction";
import {MapState} from "../../states/map/MapState";
import {
  CHANGE_TYPE_VISIBILITY,
  ChangeTypeVisibilityAction,
} from "../../actions/map/ChangeTypeVisibilityAction";
import {
  UPDATE_FILTERS,
  UpdateFiltersAction,
} from "../../actions/map/UpdateFiltersAction";

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
      console.log(addDataToMapAction);
      for (const row of addDataToMapAction.payload.datasets.data.rows) {
        const addedFeature: MapFeature = row[0].properties;
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
      for (const actionUri of changeMapFeatureStateAction.payload.uris) {
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
      break;
    }
    case CHANGE_TYPE_VISIBILITY: {
      const changeTypeVisibilityAction = action as ChangeTypeVisibilityAction;
      const targetedType = changeTypeVisibilityAction.payload.typeName;
      result.typesVisibility[targetedType] = !result.typesVisibility[
        targetedType
      ];
      break;
    }
    case UPDATE_FILTERS: {
      const updateFiltersAction = action as UpdateFiltersAction;
      const feature = updateFiltersAction.payload.feature;
      if (result.featureTypesFilters[feature.type!]) {
        if (feature.timestamp) {
          if (
            feature.timestamp <
            result.featureTypesFilters[feature.type!].timestamp.min!
          )
            result.featureTypesFilters[feature.type!].timestamp.min =
              feature.timestamp;
          else if (
            feature.timestamp >
            result.featureTypesFilters[feature.type!].timestamp.max!
          )
            result.featureTypesFilters[feature.type!].timestamp.max =
              feature.timestamp;
        }

        if (feature.frequency) {
          if (
            feature.frequency <
            result.featureTypesFilters[feature.type!].frequency.min!
          )
            result.featureTypesFilters[feature.type!].frequency.min =
              feature.frequency;
          else if (
            feature.frequency >
            result.featureTypesFilters[feature.type!].frequency.max!
          )
            result.featureTypesFilters[feature.type!].frequency.max =
              feature.frequency;
        }
      } else {
        result.featureTypesFilters[feature.type!] = {
          frequency: {
            max: feature.frequency,
            min: feature.frequency,
          },
          timestamp: {
            min: feature.timestamp,
            max: feature.timestamp,
          },
        };
      }

      break;
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
