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
import { ADD_FILTER} from "../../actions/map/AddFilterAction";

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
        /*Need to implement how to do this more dynamically. For now this works*/
        const filterStateOfType = result.featureTypesFilters[addedFeature.type!]
        if (addedFeature.timestamp) {
          if (
            addedFeature.timestamp <
            filterStateOfType.timestamp.min!
          )
            filterStateOfType.timestamp.min =
              addedFeature.timestamp;
          else if (
            addedFeature.timestamp >
            filterStateOfType.timestamp.max!
          )
            filterStateOfType.timestamp.max =
              addedFeature.timestamp;
        }

        if (addedFeature.frequency) {
          if (
            addedFeature.frequency <
            filterStateOfType.frequency.min!
          )
            filterStateOfType.frequency.min =
              addedFeature.frequency;
          else if (
            addedFeature.frequency >
            filterStateOfType.frequency.max!
          )
            filterStateOfType.frequency.max =
              addedFeature.frequency;
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

    case ADD_FILTER: {
      const addFilterAction: any = action; //any cast because AddFilterAction does not extend BaseAction (no payload property)
      const addedFeature = addFilterAction.feature;
      result.featureTypesFilters[addedFeature.type!] = {
        frequency: {
          max: addedFeature.frequency,
          min: addedFeature.frequency,
        },
        timestamp: {
          min: addedFeature.timestamp,
          max: addedFeature.timestamp,
        },
      };
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
