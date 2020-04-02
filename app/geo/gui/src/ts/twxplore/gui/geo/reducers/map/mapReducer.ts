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
import {ADD_FILTER} from "../../actions/map/AddFilterAction";
import {FeatureType} from "../../api/graphqlGlobalTypes";
import {FeatureAttributeName} from "../../states/map/FeatureAttributeName";
import {getFeatureAttributeByName} from "../../attributeStrategies/getFeatureAttributeByName";

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
    case "@@kepler.gl/ADD_DATA_TO_MAP": {
      const addDataToMapAction: any = action;
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
        /*
        Checks the filterState of the type of feature being added to the map.
        Loops throrugh the attributes of the feature, checks to see which are of type number
        and updates the min and maxes of the attribute in the filterState if neccessary
        */
        const filterStateOfType =
          result.featureTypesFilters[addedFeature.type!];
        if (addedFeature.type === FeatureType.Transmission) {
          for (const attribute of Object.keys(addedFeature)) {
            //     console.log(attribute + " " + typeof ((addedFeature as any)[attribute]));
            console.log(
              FeatureAttributeName[
                attribute as keyof typeof FeatureAttributeName
              ]
            );
            if (getFeatureAttributeByName(attribute).isNumeric) {
              {
                if (
                  (addedFeature as any)[attribute] <
                  filterStateOfType[attribute].min!
                )
                  filterStateOfType[attribute].min = (addedFeature as any)[
                    attribute
                  ];
                else if (
                  (addedFeature as any)[attribute] >
                  filterStateOfType[attribute].max!
                )
                  filterStateOfType[attribute].max = (addedFeature as any)[
                    attribute
                  ];
              }
            }
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

    case ADD_FILTER: {
      /*
      This reducer focuses on initialzing the filterState of a type when it dooes not
      exist in filterStateOfType yet.
      result.attributeIds ensures each attribute receives a unique id.
      result.filterCounter simply keeps track of how many times the ADD_FILTER action
      has been dispatched (which also implies the number of filters).
      These filters will be attached to attributes in FilterSliders.tsx
      */
      const addFilterAction: any = action; //any cast because AddFilterAction does not extend BaseAction (no payload property)
      const addedFeature: any = addFilterAction.feature;
      if (!result.featureTypesFilters[addedFeature.type!]) {
        result.featureTypesFilters[addedFeature.type!] = {};
        const filterStateOfType =
          result.featureTypesFilters[addedFeature.type!];
        for (const attribute of Object.keys(addedFeature)) {
          if (getFeatureAttributeByName(attribute).isNumeric) {
            filterStateOfType[attribute] = {min: null, max: null, idx: null};
            filterStateOfType[attribute].max = addedFeature[attribute];
            filterStateOfType[attribute].min = addedFeature[attribute];
            filterStateOfType[attribute].idx = result.attributeCounter;

            result.attributeCounter += 1;
          }
        }
      }
      result.filterCounter += 1;
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
