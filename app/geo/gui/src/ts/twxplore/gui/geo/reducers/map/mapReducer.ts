import {BaseAction} from "redux-actions";

import {MapFeatureState} from "../../states/map/MapFeatureState";
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
import {getFeatureAttributeByName} from "../../attributeStrategies/getFeatureAttributeByName";
import {
  START_QUERYING,
  StartQueryingAction,
} from "../../actions/map/StartQueryingAction";
import {
  COMPLETED_QUERY,
  CompletedQueryAction,
} from "../../actions/map/CompletedQueryAction";
import {
  FINISH_LOAD_ACTION,
  FinishLoadAction,
} from "../../actions/map/FinishLoadAction";

export const mapReducer = (state: MapState, action: BaseAction): MapState => {
  const result: MapState = Object.assign({}, state);

  switch (action.type) {
    /*
    In this step, features are added to the features list and featuresByType map in state.
    When a list in featuresByType is changed, then dirty is set to true.
    */
    case ADD_MAP_FEATURES: {
      const addMapFeaturesAction = action as AddMapFeaturesAction;
      for (const feature of addMapFeaturesAction.payload.features) {
        result.features.push(feature);
        result.featuresByType[
          feature.type! as keyof typeof result.featuresByType
        ].features.push(feature);
        result.featuresByType[
          feature.type! as keyof typeof result.featuresByType
        ].dirty = true;
      }
      break;
    }

    case "@@kepler.gl/ADD_DATA_TO_MAP": {
      const addDataToMapAction: any = action;
      for (const row of addDataToMapAction.payload.datasets.data.rows) {
        const addedFeature: any = row[0].properties;
        for (const resultFeature of result.features) {
          if (resultFeature.uri === addedFeature.uri) {
            resultFeature.state = MapFeatureState.RENDERED;
            result.featuresByType[
              resultFeature.type! as keyof typeof result.featuresByType
            ].dirty = false;
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
        if (!result.featureTypesFilters[addedFeature.type!]) {
          //if this is the first time we are coming across this type
          result.featureTypesFilters[addedFeature.type!] = {};
          //needsFilter set to true. addFilter will be called to this type in the RENDERED case.
          result.featuresByType[addedFeature.type!].needsFilters = true;
        }
        let filterStateOfType = result.featureTypesFilters[addedFeature.type!];
        for (const attribute of Object.keys(addedFeature)) {
          if (getFeatureAttributeByName(attribute).isNumeric) {
            if (!filterStateOfType[attribute]) {
              filterStateOfType[attribute] = {
                min: null,
                max: null,
                idx: null,
              };
              filterStateOfType[attribute].max = addedFeature[attribute];
              filterStateOfType[attribute].min = addedFeature[attribute];
              filterStateOfType[attribute].idx = result.attributeCounter;

              result.attributeCounter += 1;
            } else {
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
      break;
    }
    case FINISH_LOAD_ACTION: {
      const finishLoadAction = action as FinishLoadAction;
      for (const actionUri of finishLoadAction.payload.uris) {
        for (const resultFeature of result.features) {
          if (resultFeature.uri === actionUri) {
            resultFeature.state = MapFeatureState.RENDERED;
          }
        }
        delete result.loadingState[actionUri];
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

    case START_QUERYING: {
      const startQueryingAction = action as StartQueryingAction;
      const featureUri = startQueryingAction.payload.uri;
      result.loadingState[featureUri] = {
        offset: 0,
        latestQueryLength: 0,
        queryInProgress: true,
      };
      for (const resultFeature of result.features) {
        if (resultFeature.uri === featureUri) {
          resultFeature.state = MapFeatureState.CLICKED_AND_LOADING;
        }
      }
      break;
    }

    case COMPLETED_QUERY: {
      const completedQueryAction = action as CompletedQueryAction;
      const featureUri = completedQueryAction.payload.uri;
      const latestQueryLength = completedQueryAction.payload.latestQueryLength;
      if (!result.loadingState[featureUri]) {
        throw Error(
          "There should be a loading state for the feature at this point."
        );
      } else {
        result.loadingState[featureUri].queryInProgress = false;
        result.loadingState[featureUri].offset += latestQueryLength;
        result.loadingState[featureUri].latestQueryLength = latestQueryLength;
      }
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
      const addFilterAction = action as any;
      //addFilter has been called on the type. Set needsFilters to false.
      result.featuresByType[addFilterAction.dataId].needsFilters = false;
      result.featuresByType[addFilterAction.dataId].filtersAdded = true;

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
              MapFeatureState.CLICKED
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
