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
import {updateAttributeStatesOfFeatureType} from "../../reducerFunctions/updateAttributeStatesOfFeatureType";
import {setAllFilterIndexesNull} from "../../reducerFunctions/setAllFilterIndexesNull";
import {getFeatureFromStateFeaturesList} from "../../reducerFunctions/getFeatureFromStateFeaturesList";
import {CLICK_ROOT} from "../../actions/map/ClickRootAction";

export const mapReducer = (state: MapState, action: BaseAction): MapState => {
  const result: MapState = Object.assign({}, state);

  switch (action.type) {
    /*
    Triggered from Map.tsx for features after a query is completed
    In this step, features are added to the features list and featuresByType map in state.
    When a list in featuresByType is changed, then dirty is set to true.
    */
    case ADD_MAP_FEATURES: {
      console.debug("ADD_MAP_FEATURES action being handled");
      const addMapFeaturesAction = action as AddMapFeaturesAction;
      //for each feature provided by the action payload
      for (const feature of addMapFeaturesAction.payload.features) {
        //push the feature into the feature list provided by the state
        result.features.push(feature);
        let featuresByTypeOfFeatureType = result.featuresByType[feature.type!];
        //push the feature into the featureByType list provided by the state
        featuresByTypeOfFeatureType.features.push(feature);
        //Because the list was modified, set the 'dirty' variable to true
        featuresByTypeOfFeatureType.dirty = true;
        // if the featureTypeState is ABSENT_ON_MAP indicating that this is the first time a feature of this feature type is being added
        if (
          featuresByTypeOfFeatureType.featureTypeState ===
          MapFeatureTypeState.ABSENT_ON_MAP
        ) {
          featuresByTypeOfFeatureType.visible = true;
        }
        //Set featureTypeState for this FeatureType to WAITING_FOR_LOAD because a load is ongoing and
        //to ensure that filters for this feature type will not be added until all queries are completed
        featuresByTypeOfFeatureType.featureTypeState =
          MapFeatureTypeState.WAITING_FOR_LOAD;
      }
      console.debug("ADD_MAP_FEATURES action completed.");
      break;
    }

    /*
    Handles the action that renders features onto the map.
    Triggered from Map.tsx for features in the LOADED switch-case.
    */
    case "@@kepler.gl/ADD_DATA_TO_MAP": {
      console.debug("ADD_DATA_TO_MAP action being handled");
      const addDataToMapAction: any = action;
      //This action is a KeplerGL action, and features are put into 'rows'
      for (const row of addDataToMapAction.payload.datasets.data.rows) {
        //Retrieving the feature in the row
        const addedFeature: MapFeature = row[0].properties;
        //if the uri of the addedFeature and a feature in the redux state match
        const resultFeature = getFeatureFromStateFeaturesList(
          result.features,
          addedFeature.uri
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

        result.loadingMessage =
          "Adding features of type " + resultFeature.type + " to map...";
        //attributeStatesOfFeatureType is now an object, with each of its properties being the state of an attribute of the addedFeature's FeatureType.
        //i.e. attributeStatesOfFeature = {frequency: {min:0, max:100, filterIndex: 0}, tranmsmissionPower: {min:0, max:20, filterIndex: 1}}
        const attributeStatesOfFeatureType =
          result.featuresByType[addedFeature.type!].attributeStates;
        console.debug(attributeStatesOfFeatureType);

        //Compare the attributes of the addedFeature to what is stored on the state. Update if neccessary.
        updateAttributeStatesOfFeatureType(
          attributeStatesOfFeatureType,
          addedFeature
        );
      }
      console.debug("ADD_DATA_TO_MAP action completed.");
      break;
    }
    /*
    This action is dispatched and handled when the last query to retrieve all features within a feature
    has completed. There are no more queries to do, it has finished loading, and so we need to remove the loading state of the
    feature from loadingState and change the state of the feature back to RENDERED.
    */
    case FINISH_LOAD_ACTION: {
      console.debug("FINISH_LOAD_ACTION started");
      const finishLoadAction = action as FinishLoadAction;
      //for all features that have finished loading
      for (const actionUri of finishLoadAction.payload.uris) {
        //if the uri provided by the action payload and a feature in the redux state match
        //then get the feature from the redux state
        const resultFeature = getFeatureFromStateFeaturesList(
          result.features,
          actionUri
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

        var filterIndexCounter = 0;
        //Set FeatureTypeState of all FeatureTypes that are 'WAITING_FOR_LOAD' to 'NEEDS_FILTERS'
        for (const featureType of Object.values(FeatureType)) {
          let featuresByTypeOfType =
            result.featuresByType[featureType as keyof typeof FeatureType];
          let attributeStatesOfFeatureType =
            result.featuresByType[featureType as keyof typeof FeatureType]
              .attributeStates;

          if (
            featuresByTypeOfType.featureTypeState ===
            MapFeatureTypeState.WAITING_FOR_LOAD
          ) {
            if (featureType === FeatureType.Transmission) {
              featuresByTypeOfType.featureTypeState =
                MapFeatureTypeState.FINISHED_SETUP;
            } else {
              featuresByTypeOfType.featureTypeState =
                //Set FeatureTypeState of all FeatureTypes that are 'WAITING_FOR_LOAD' to 'NEEDS_FILTERS'
                MapFeatureTypeState.FINISHED_SETUP;
            }
            //Now that this FeatureType needs filters, give each attribute a filter idx using a counter
            Object.keys(attributeStatesOfFeatureType).map(attributeName => {
              attributeStatesOfFeatureType[
                attributeName
              ].filterIndex = filterIndexCounter;
              filterIndexCounter += 1;
            });
          }
        }
      }
      console.debug("FINISH_LOAD_ACTION complete");
      break;
    }

    //Probably needs some reworking
    case CHANGE_TYPE_VISIBILITY: {
      const changeTypeVisibilityAction = action as ChangeTypeVisibilityAction;
      const featureType = changeTypeVisibilityAction.payload.typeName;
      result.featuresByType[featureType].visible! = !result.featuresByType[
        featureType
      ].visible!;
      break;
    }

    /*
    This action is dispatched and handled when the first query to retrieve all features within a feature
    has begun. The loading state of the feature is initialized in loadingState with default values. The
    feature is put into the CLICKED_AND_LOADING state
    */
    case START_QUERYING: {
      console.debug("START_QUERYING action being handled");
      const startQueryingAction = action as StartQueryingAction;
      //Uri of the feature being queried
      const featureUri = startQueryingAction.payload.uri;
      //Create loading state of the feature with default values.
      result.loadingState[featureUri] = {
        offset: 0,
        latestQueryLength: 0,
        queryInProgress: true,
      };
      result.loadingMessage = "Querying for features...";

      const resultFeature = getFeatureFromStateFeaturesList(
        result.features,
        featureUri
      );
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
        let attributeStatesOfFeatureType =
          result.featuresByType[featureType as keyof typeof FeatureType]
            .attributeStates;

        setAllFilterIndexesNull(attributeStatesOfFeatureType);

        if (
          //If features of that type are present on the map
          featuresByTypeOfType.featureTypeState !=
          MapFeatureTypeState.ABSENT_ON_MAP
        ) {
          //Set the state of the featureTypeState to WAITING_FOR_LOAD
          //because a query has started. Filters and layers are going to be removed
          //and we need to wait for the queries to end before re-adding the filters.
          featuresByTypeOfType.featureTypeState =
            MapFeatureTypeState.WAITING_FOR_LOAD;
          //
        }
      }
      console.debug("START_QUERYING action completed");
      break;
    }

    case REPEAT_QUERY: {
      console.debug("REPEAT_QUERY action being handled");
      const repeatQueryAction = action as RepeatQueryAction;
      const featureUri = repeatQueryAction.payload.featureUri;
      if (!result.loadingState[featureUri]) {
        throw Error(
          "There should be a loading state for the feature at this point."
        );
      }
      //the queryInProgress variable for this state becomes true as we are going to repeat the query but with a different offset
      result.loadingState[featureUri].queryInProgress = true;
      result.loadingMessage = "Querying for more features...";
      console.debug("REPEAT_QUERY action completed.");
      break;
    }

    /*
    This action is dispatched and handled when a query to retrieve all features within a feature
    has completed. This is different from FINISH_LOAD_ACTION, which is called only when the LAST query
    has completed. After the last query, COMPLETED_QUERY is called before FINISH_LOAD_ACTION. The loading state of the feature is updated
    with the results of every query after it has been completed.
    */

    case COMPLETED_QUERY: {
      console.debug("COMPLETED_QUERY action being handled");
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
      result.loadingMessage = "Completed Query. Adding some features...";
      console.debug("COMPLETE_QUERY action completed");
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
      console.debug("ADD_FILTER action being handled");
      const addFilterAction = action as any;
      //addFilter has been called on the type. Set featureTypeState to FILTERS_ADDED to indicate the process
      //for adding a filter for each filterable attribute of this feature type has begun
      result.featuresByType[addFilterAction.dataId].featureTypeState =
        MapFeatureTypeState.NEEDS_INITIAL_FILTER_SETTING;
      //Increment filterCounter on the redux state, because a filter has just been added.
      result.filterCounter += 1;
      console.debug("ADD_FILTER action completed");
      break;
    }

    case ALL_FILTERS_SET: {
      console.debug("ALL_FILTERS_SET action being handled");
      const allFiltersSetAction = action as AllFiltersSetAction;
      result.featuresByType[
        allFiltersSetAction.payload.featureType
      ].featureTypeState = MapFeatureTypeState.NEEDS_LAYER_LABEL;
      console.debug("ALL_FILTERS_SET action completed");
      break;
    }

    case CLICK_ROOT: {
      const rootFeature = result.features.find(
        ({type}) => type === FeatureType.Root
      );
      if (!rootFeature) {
        throw Error("No root feature in features list!");
      }
      rootFeature.state = MapFeatureState.CLICKED;
      break;
    }

    case "@@kepler.gl/REMOVE_FILTER": {
      console.debug("REMOVE_FILTER action being handled");
      //Decrement filterCounter on the redux state, because a filter has just been removed.
      result.filterCounter -= 1;
      console.debug("REMOVE_FILTER action compeleted");
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
      console.debug("LAYER_CLICK action being handled");
      const layerClickAction: any = action;

      if (layerClickAction.payload.info === null) {
        break;
      }
      const resultFeature = getFeatureFromStateFeaturesList(
        result.features,
        layerClickAction.payload.info.object.properties.uri
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
      console.debug("LAYER_CLICK action completed");

      break;
    }
    case "@@kepler.gl/LAYER_CONFIG_CHANGE": {
      const layerConfigChangeAction: any = action;
      const layerIdOfFeatureType: string =
        layerConfigChangeAction.oldLayer.config.dataId;
      let featuresByTypeOfFeatureType =
        result.featuresByType[layerIdOfFeatureType];
      if (layerConfigChangeAction.newConfig != undefined) {
        //case: NEEDS_LABEL
        if (Object.keys(layerConfigChangeAction.newConfig).includes("label")) {
          if (
            FeatureType[layerIdOfFeatureType as keyof typeof FeatureType] ===
            FeatureType.Transmission
          ) {
            featuresByTypeOfFeatureType.featureTypeState =
              MapFeatureTypeState.NEEDS_LAYER_CHANGE;
          } else {
            featuresByTypeOfFeatureType.featureTypeState =
              MapFeatureTypeState.FINISHED_SETUP;
          }
        }
        //case: NEEDS_LNG_AND_LAT
        if (
          Object.keys(layerConfigChangeAction.newConfig).includes("columns")
        ) {
          result.featuresByType[FeatureType.Transmission].featureTypeState =
            MapFeatureTypeState.NEEDS_3D_ENABLED;
        }
      }

      break;
    }
    case "@@kepler.gl/LAYER_TYPE_CHANGE": {
      result.featuresByType[FeatureType.Transmission].featureTypeState =
        MapFeatureTypeState.NEEDS_LNG_AND_LAT;
      break;
    }
    //Needs 3d Enabled
    case "@@kepler.gl/LAYER_VIS_CONFIG_CHANGE": {
      const layerVisConfigChangeAction: any = action;
      if (
        Object.keys(layerVisConfigChangeAction.newVisConfig).includes(
          "enable3d"
        )
      ) {
        result.featuresByType[FeatureType.Transmission].featureTypeState =
          MapFeatureTypeState.FINISHED_SETUP;
      }

      break;
    }

    case "@@kepler.gl/LAYER_VISUAL_CHANNEL_CHANGE": {
      result.featuresByType[FeatureType.Transmission].featureTypeState =
        MapFeatureTypeState.FINISHED_SETUP;

      break;
    }

    default: {
      console.log("mapReducer: ignoring action type " + action.type);
      break;
    }
  }

  return result;
};
