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
import {FeatureType} from "../../api/graphqlGlobalTypes";
import {
  ALL_FILTERS_SET,
  AllFiltersSetAction,
} from "../../actions/map/AllFiltersSetAction";

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
        //Set featureTypeState for this FeatureType to WAITING_FOR_LOAD to ensure that filters
        //for this feature type will not be added until all queries are completed
        result.featuresByType[
          feature.type! as keyof typeof result.featuresByType
        ].featureTypeState = MapFeatureTypeState.WAITING_FOR_LOAD;
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
        //if the uri of the addedFeature and a feature in the redux state match
        const resultFeature = result.features.find(
          ({uri}) => uri === addedFeature.uri
        );
        if (!resultFeature) {
          throw Error(
            "Features are not added to the map until after they are loaded,\
              and therefore it should exist in the features list on the state.\
              (Look at code ADD_MAP_FEATURES reducer case)"
          );
        }

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

        /*
        Check the filterState of the type of feature being added to the map.
        Loop throrugh the attributes of the feature and check to see which are of type number.
        Updates the min and maxes of the attributes in the filterState if necessary.
        */

        //filterStateOfFeatureType is now an object with properties containing relevant info needed to filter attributes of the feature type.
        let attributesStateOfFeatureType =
          result.featuresByType[addedFeature.type!].attributesState;
        //Loop through the feature's attribute
        for (const attribute of Object.keys(addedFeature)) {
          //If the arttribute is numeric
          if (getFeatureAttributeByName(attribute).isNumeric) {
            //If this is the first time coming across this attribute for this feature type
            if (!attributesStateOfFeatureType[attribute].min) {
              //New max of the attribute wil be the feature's value for the attribute
              attributesStateOfFeatureType[
                attribute
              ].max = (addedFeature as any)[attribute];
              //New min of the attribute wil be the feature's value for the attribute
              attributesStateOfFeatureType[
                attribute
              ].min = (addedFeature as any)[attribute];
            }
            //If this is NOT the first time coming across this attribute for this feature tpye
            else {
              //Compare attribute value to the min found in the attribute state. Set new min if necessary.
              if (
                (addedFeature as any)[attribute] <
                attributesStateOfFeatureType[attribute].min!
              )
                attributesStateOfFeatureType[
                  attribute
                ].min = (addedFeature as any)[attribute];
              //Compare attribute value to the max found in the attribute state. Set new max if necessary.
              else if (
                (addedFeature as any)[attribute] >
                attributesStateOfFeatureType[attribute].max!
              )
                attributesStateOfFeatureType[
                  attribute
                ].max = (addedFeature as any)[attribute];
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
        //if the uri provided by the action payload and a feature in the redux state match
        //then get the feature from the redux state
        const resultFeature = result.features.find(
          ({uri}) => uri === actionUri
        );
        if (!resultFeature) {
          throw Error(
            "Attempt to change state of feature from CLICKED_AND_LOADING to RENDERED failed.\
            Feature does not exist in features list in the redux state"
          );
        }

        //Set the state of the feature from CLICKED_AND_LOADING to RENDERED
        resultFeature.state = MapFeatureState.RENDERED;

        //Remove the loading state of the feature from loadingState
        delete result.loadingState[actionUri];

        //Set FeatureTypeState of all FeatureTypes that are 'WAITING_FOR_LOAD' to 'NEEDS_FILTERS'
        for (const featureType of Object.values(FeatureType)) {
          let featuresByTypeOfType =
            result.featuresByType[featureType as keyof typeof FeatureType];
          let filterTypeStateOfFeatureType =
            result.featuresByType[featureType as keyof typeof FeatureType]
              .attributesState;

          if (
            featuresByTypeOfType.featureTypeState ===
            MapFeatureTypeState.WAITING_FOR_LOAD
          ) {
            featuresByTypeOfType.featureTypeState =
              //Set FeatureTypeState of all FeatureTypes that are 'WAITING_FOR_LOAD' to 'NEEDS_FILTERS'
              MapFeatureTypeState.NEEDS_FILTERS;
            //Give each attribute with the FeatureType that is filterable a filter idx (index)
            Object.keys(filterTypeStateOfFeatureType).map(attributeName => {
              filterTypeStateOfFeatureType[attributeName].filterIndex =
                result.filterableAttributesCounter;
              result.filterableAttributesCounter += 1;
            });
          }
        }
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

      const resultFeature = result.features.find(({uri}) => uri === featureUri);
      if (!resultFeature) {
        throw Error(
          "Attempt to change state of feature from CLICKED to CLICKED_AND_LOADING failed.\
          Feature does not exist in features list in the redux state"
        );
      }

      //Change the state of the feature to CLICKED_AND_LOADING where it may queried further.
      resultFeature.state = MapFeatureState.CLICKED_AND_LOADING;

      //Change state of all feature types that have had their filters added to WAITING FOR LOAD because a query has just started
      //for each FeatureType
      for (const featureType of Object.values(FeatureType)) {
        let featuresByTypeOfType =
          result.featuresByType[featureType as keyof typeof FeatureType];
        let filterTypeStateOfFeatureType =
          result.featuresByType[featureType as keyof typeof FeatureType]
            .attributesState;

        if (
          //If the filters of the attributes of a FeatureType have been added/set
          featuresByTypeOfType.featureTypeState ===
            MapFeatureTypeState.FILTERS_ADDED ||
          featuresByTypeOfType.featureTypeState ===
            MapFeatureTypeState.FILTERS_SET
        ) {
          //Set the state of the featureTypeState to WAITING_FOR_LOAD
          //because a query has started. Filters are going to be removed
          //and we need to wait for the queries to end before re-adding the filters.
          featuresByTypeOfType.featureTypeState =
            MapFeatureTypeState.WAITING_FOR_LOAD;
          Object.keys(filterTypeStateOfFeatureType).map(attributeName => {
            //Set the filter index for all attributes within the filter to null because filter are being removed
            filterTypeStateOfFeatureType[attributeName].filterIndex = null;
          });
        }
      }
      //Reset the attribute counter as no attributes are filterable at the time.
      result.filterableAttributesCounter = 0;

      break;
    }

    case REPEAT_QUERY: {
      const repeatQueryAction = action as RepeatQueryAction;
      const featureUri = repeatQueryAction.payload.featureUri;
      if (!result.loadingState[featureUri]) {
        throw Error(
          "There should be a loading state for the feature at this point."
        );
      }
      //the queryInProgress variable for this state becomes true as we are going to repeat the query but with a different offset
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
      //addFilter has been called on the type. Set featureTypeState to FILTERS_ADDED to indicate the process
      //for adding a filter for each filterable attribute of this feature type has begun
      result.featuresByType[addFilterAction.dataId].featureTypeState =
        MapFeatureTypeState.FILTERS_ADDED;
      //Increment filterCounter on the redux state, because a filter has just been added.
      result.filterCounter += 1;
      break;
    }

    case ALL_FILTERS_SET: {
      const allFiltersSetAction = action as AllFiltersSetAction;
      result.featuresByType[
        allFiltersSetAction.payload.featureType
      ].featureTypeState = MapFeatureTypeState.FILTERS_SET;
      break;
    }

    case "@@kepler.gl/REMOVE_FILTER": {
      //Decrement filterCounter on the redux state, because a filter has just been removed.
      result.filterCounter -= 1;
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

      const resultFeature = result.features.find(
        ({uri}) => uri === layerClickAction.payload.info.object.properties.uri
      );
      if (!resultFeature) {
        throw Error(
          "Attempt to change state of feature from RENDERED to CLICKED failed.\
          Feature does not exist in features list in the redux state"
        );
      }

      //Change the state of the feature to CLICKED
      resultFeature.state = MapFeatureState.CLICKED;
      console.debug(
        "changed map feature " +
          resultFeature.uri +
          " to state " +
          MapFeatureState.CLICKED
      );
      break;
    }
    default: {
      console.log("mapReducer: ignoring action type " + action.type);
    }
  }

  return result;
};
