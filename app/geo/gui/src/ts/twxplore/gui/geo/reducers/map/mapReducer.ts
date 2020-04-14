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
import {MapFeature} from "../../states/map/MapFeature";
import {
  REPEAT_QUERY,
  RepeatQueryAction,
} from "../../actions/map/RepeatQueryAction";
import {MapFeatureTypeState} from "../../states/map/MapFeatureTypeState";

export const mapReducer = (state: MapState, action: BaseAction): MapState => {
  const result: MapState = Object.assign({}, state);

  switch (action.type) {
    /*
    In this step, features are added to the features list and featuresByType map in state.
    When a list in featuresByType is changed, then dirty is set to true.
    */
    case ADD_MAP_FEATURES: {
      const addMapFeaturesAction = action as AddMapFeaturesAction;
      //for each feature provided by the action payload
      for (const feature of addMapFeaturesAction.payload.features) {
        //push the feature into the feature list provided by the state
        result.features.push(feature);
        //push the feature into the featureByType list provided by the state
        result.featuresByType[
          feature.type! as keyof typeof result.featuresByType
        ].features.push(feature);
        //Because the list was modified, set the 'dirty' variable to true
        result.featuresByType[
          feature.type! as keyof typeof result.featuresByType
        ].dirty = true;
      }
      break;
    }

    /*
    Handles the action that renders features onto the map
    */
    case "@@kepler.gl/ADD_DATA_TO_MAP": {
      const addDataToMapAction: any = action;
      //This action is a KeplerGL action, and features are put into 'rows'
      for (const row of addDataToMapAction.payload.datasets.data.rows) {
        //Retrieving the feature in the row
        const addedFeature: MapFeature = row[0].properties;
        //Looping through all features stored in the redux state currently
        for (const resultFeature of result.features) {
          //if the uri of the addedFeature and a feature in the redux state match
          if (resultFeature.uri === addedFeature.uri) {
            //Change the state of the feature to RENDERED, because we are putting it on the map
            resultFeature.state = MapFeatureState.RENDERED;
            //Change the dirty variable for that feature type to false, as it is obvious we are now adding
            //features of that type to the map.
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
        Check the filterState of the type of feature being added to the map.
        Loop throrugh the attributes of the feature and check to see which are of type number.
        Updates the min and maxes of the attributes in the filterState if necessary.
        */
        if (!result.featureTypesFilters[addedFeature.type!]) {
          //if this is the first time we are coming across this type
          result.featureTypesFilters[addedFeature.type!] = {};
          //Set featureTypeState to NEEDS_FILTERS. addFilter will be called to this type in the RENDERED case.
          result.featuresByType[addedFeature.type!].featureTypeState =
            MapFeatureTypeState.NEEDS_FILTERS;
        }
        //filterStateOfType is now the an object with properties containing relevant info needed to filter attributes of the feature type.
        let filterStateOfType = result.featureTypesFilters[addedFeature.type!];
        //Loop through the feature's attribute
        for (const attribute of Object.keys(addedFeature)) {
          //If the arttribute is numeric
          if (getFeatureAttributeByName(attribute).isNumeric) {
            //If this is the first time coming across this attribute for this feature type
            if (!filterStateOfType[attribute]) {
              //Create a state for the attribute, with all properties set to null initially.
              filterStateOfType[attribute] = {
                min: null,
                max: null,
                idx: null,
              };
              //New max of the attribute wil be the feature's value for the attribute
              filterStateOfType[attribute].max = (addedFeature as any)[
                attribute
              ];
              //New min of the attribute wil be the feature's value for the attribute
              filterStateOfType[attribute].min = (addedFeature as any)[
                attribute
              ];
              //Set the idx (index) for the attribute state from the attributeCounter.
              filterStateOfType[attribute].idx = result.attributeCounter;
              //Since we've handled a new attribute, increment the attributeCounter
              result.attributeCounter += 1;
            }
            //If this is NOT the first time coming across this attribute for this feature tpye
            else {
              //Compare attribute value to the min found in the attribute state. Set new min if necessary.
              if (
                (addedFeature as any)[attribute] <
                filterStateOfType[attribute].min!
              )
                filterStateOfType[attribute].min = (addedFeature as any)[
                  attribute
                ];
              //Compare attribute value to the max found in the attribute state. Set new max if necessary.
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
    /*
    This action is dispatched and handled when the last query to retrieve all features within a feature
    has completed. There are no more queries to do, it has finished loading, and so we need to remove the loading state of the
    feature from loadingState and change the state of the feature back to RENDERED.
    */
    case FINISH_LOAD_ACTION: {
      const finishLoadAction = action as FinishLoadAction;
      //for all features that have finished loading
      for (const actionUri of finishLoadAction.payload.uris) {
        //for all features in the redux state
        for (const resultFeature of result.features) {
          //If (when) we have found the feature in the redux state
          if (resultFeature.uri === actionUri) {
            //Set the state of the feature from CLICKED_AND_LOADING to RENDERED
            resultFeature.state = MapFeatureState.RENDERED;
          }
        }
        //Remove the loading state of the feature from loadingState
        delete result.loadingState[actionUri];
      }
      break;
    }

    //Probably needs some reworking
    case CHANGE_TYPE_VISIBILITY: {
      const changeTypeVisibilityAction = action as ChangeTypeVisibilityAction;
      const targetedType = changeTypeVisibilityAction.payload.typeName;
      result.typesVisibility[targetedType] = !result.typesVisibility[
        targetedType
      ];
      break;
    }

    /*
    This action is dispatched and handled when the first query to retrieve all features within a feature
    has begun. The loading state of the feature is initialized in loadingState with default values. The
    feature is put into the CLICKED_AND_LOADING state
    */
    case START_QUERYING: {
      const startQueryingAction = action as StartQueryingAction;
      //Uri of the feature being queried
      const featureUri = startQueryingAction.payload.uri;
      //Create loading state of the feature with default values.
      result.loadingState[featureUri] = {
        offset: 0,
        latestQueryLength: 0,
        queryInProgress: true,
      };
      for (const resultFeature of result.features) {
        if (resultFeature.uri === featureUri) {
          //Change the state of the feature to CLICKED_AND_LOADING where it may queried further.
          resultFeature.state = MapFeatureState.CLICKED_AND_LOADING;
        }
      }
      break;
    }

    case REPEAT_QUERY: {
      const repeatQueryAction = action as RepeatQueryAction;
      const featureUri = repeatQueryAction.payload.uri;
      if (!result.loadingState[featureUri]) {
        throw Error(
          "There should be a loading state for the feature at this point."
        );
      }
      result.loadingState[featureUri].queryInProgress = true;
      break;
    }

    /*
    This action is dispatched and handled when a query to retrieve all features within a feature
    has completed. This is different from FINISH_LOAD_ACTION, which is called only when the LAST query
    has completed. After the last query, COMPLETED_QUERY is called before FINISH_LOAD_ACTION. The loading state of the feature is updated
    with the results of every query after it has been completed.
    */

    case COMPLETED_QUERY: {
      const completedQueryAction = action as CompletedQueryAction;
      const featureUri = completedQueryAction.payload.uri;
      const latestQueryLength = completedQueryAction.payload.latestQueryLength;
      //If the feature does not have loading state in loadingState
      if (!result.loadingState[featureUri]) {
        throw Error(
          "There should be a loading state for the feature at this point."
        );
      } else {
        //queryInProgress set to false because the query just finished
        result.loadingState[featureUri].queryInProgress = false;
        //The new offset needs to account for the length of the results from the last query
        result.loadingState[featureUri].offset += latestQueryLength;
        //Track the length of the last query.
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
      //addFilter has been called on the type. Set featureTypeState to FILTERS_ADDED
      result.featuresByType[addFilterAction.dataId].featureTypeState =
        MapFeatureTypeState.FILTERS_ADDED;
      //Increment filterCounter on the redux state, because a filter has just been added.
      result.filterCounter += 1;
      break;
    }

    case "@@kepler.gl/REGISTER_ENTRY":
      result.keplerGlInstanceRegistered = true;
      break;

    /*
    This action is dispatched and handled when a feature is clicked. It's purpose is
    to change the state of the feature to CLICKED
    */
    case "@@kepler.gl/LAYER_CLICK": {
      const layerClickAction: any = action;
      for (const resultFeature of result.features) {
        //If the clicked feature has been found in the redux state
        if (
          resultFeature.uri ===
          layerClickAction.payload.info.object.properties.uri
        ) {
          //Change the state of the feature to CLICKED
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
