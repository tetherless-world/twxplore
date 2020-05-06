import {addDataToMap, removeFilter, removeDataset} from "kepler.gl/actions";
import {connect, useDispatch, useSelector} from "react-redux";
import * as featuresQueryDocument from "twxplore/gui/geo/api/queries/MapFeaturesQuery.graphql";
import {RootState} from "../../states/root/RootState";
import {MapState} from "../../states/map/MapState";
import {
  MapFeaturesQuery,
  MapFeaturesQueryVariables,
  MapFeaturesQuery_features,
} from "../../api/queries/types/MapFeaturesQuery";
import {useLazyQuery} from "@apollo/react-hooks";
import {addMapFeatures} from "../../actions/map/AddMapFeaturesAction";
import {MapFeatureState} from "../../states/map/MapFeatureState";
import Processors from "kepler.gl/processors";
import KeplerGl from "kepler.gl";
//import ReactResizeDetector from "react-resize-detector";
import * as React from "react";
import {FeatureType} from "../../api/graphqlGlobalTypes";
//import {finishLoad} from "../../actions/map/FinishLoadAction";
import {getFeaturesByState} from "../../selectors/getFeaturesByState";
import {MapFeature} from "../../states/map/MapFeature";
import {addFilter} from "../../actions/map/AddFilterAction";
import {completedQuery} from "../../actions/map/CompletedQueryAction";
import {startQuerying} from "../../actions/map/StartQueryingAction";
import {finishLoad} from "../../actions/map/FinishLoadAction";
import {repeatQuery} from "../../actions/map/RepeatQueryAction";
import {MapFeatureTypeState} from "../../states/map/MapFeatureTypeState";
import ReactResizeDetector from "react-resize-detector";
import {FeaturesByType} from "../../states/map/FeaturesByType";
import * as _ from "lodash";
import * as Loader from "react-loader";
import {getFeatureTypeStrategyByName} from "../../featureTypeStrategies/getFeatureTypeStrategyByName";
//import KeplerGlSchema from "kepler.gl/schemas";

const LIMIT = 500;
const DEBUG = true;
const DEBUG_FEATURES_MAX = 5000;
var wkt = require("terraformer-wkt-parser");
const stateJSON: MapFeaturesQuery_features[] = require("../../../../../../json/stateJSON.json");
const MapImpl: React.FunctionComponent = () => {
  //const logger: Logger = React.useContext(LoggerContext);
  const dispatch = useDispatch();

  const state: MapState = useSelector(
    (rootState: RootState) => rootState.app.map
  );

  const keplerState: any = useSelector(
    (rootState: RootState) => rootState.keplerGl
  );

  // LazyQuery to get features within a feature.
  const [getFeaturesWithin, getFeaturesWithinResults] = useLazyQuery<
    MapFeaturesQuery,
    MapFeaturesQueryVariables
  >(featuresQueryDocument, {
    onCompleted: (data: MapFeaturesQuery) => {
      //dispatch an action to reflect a query just finishing. The loadingState for the query will be updated
      dispatch(
        completedQuery(
          getFeaturesWithinResults.variables.query.withinFeatureUri!,
          data.features.length
        )
      );
      // dispatch an action to which will put the features in LOADING state and add the features to lists in the store.
      dispatch(
        addMapFeatures(
          data.features.map(feature => ({
            __typename: feature.__typename,
            geometry: feature.geometry,
            label: feature.label,
            frequency: feature.frequency,
            timestamp: feature.timestamp ? feature.timestamp * 1000 : null,
            type: feature.type,
            uri: feature.uri,
            locality: feature.locality,
            regions: feature.regions,
            postalCode: feature.postalCode,
            transmissionPower: feature.transmissionPower,
            state: MapFeatureState.LOADED,
          }))
        )
      );
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
  });

  //This function checks if any of the featureByTypes are 'dirty'
  const hasDirtyFeatures = (featuresByType: {
    [featureType: string]: FeaturesByType;
  }) => {
    for (const featureType of Object.values(FeatureType)) {
      //Check if filters need to be added for this FeatureType
      if (featuresByType[featureType].dirty) {
        return true;
      }
    }
    return false;
  };

  const queryInProgress = Object.keys(state.loadingState).some(
    clickedUri => state.loadingState[clickedUri].queryInProgress
  );
  //if there are no states loaded
  if (state.features.length === 0) {
    //if the data variable has been loaded
    if (keplerState.map) {
      // Not tracking any features yet, add the states from the stateJSON file.
      dispatch(
        addMapFeatures(
          stateJSON.map(feature => ({
            __typename: feature.__typename,
            geometry: feature.geometry,
            label: feature.label,
            frequency: feature.frequency,
            timestamp: feature.timestamp,
            type: feature.type,
            uri: feature.uri,
            locality: feature.locality,
            regions: feature.regions,
            postalCode: feature.postalCode,
            transmissionPower: feature.transmissionPower,
            state: MapFeatureState.LOADED,
          }))
        )
      );
    }
  }

  // Organize the features by their state
  const featuresByState: {
    [index: string]: MapFeature[];
  } = useSelector(getFeaturesByState);

  // Feature state machine
  for (const featureState in featuresByState) {
    const featuresInState = featuresByState[featureState];
    switch (featureState) {
      case MapFeatureState.LOADED: {
        /*
        Features in this state have been queried, created and pushed into the
        features state list that is located on the store. They have also been pushed into the appropriate place of the 
        featuresByType map located on the store. During this process, the 'dirty' variable of the lists in which they were pushed have
        been set to true. The next step is to loop through each list of featuresByType and re-add the features to the map
        if their dirty variable is true.
        */

        //looping through every featureType available.
        for (const featureType of Object.values(FeatureType)) {
          //if the dirty variable indicates that the list of features of that type has been modified since last add
          if (state.featuresByType[featureType].dirty) {
            //Get the features of the feature type that is dirty.
            const dirtyFeaturesOfFeatureType =
              state.featuresByType[featureType].features;
            //create new dataset with
            const datasets = {
              data: Processors.processGeojson({
                type: "FeatureCollection",
                features: dirtyFeaturesOfFeatureType.map(feature => {
                  return {
                    type: "Feature",
                    geometry: wkt.parse(feature.geometry.wkt),
                    properties: feature,
                  };
                }),
              }),
              info: {
                id: featureType,
              },
            };
            //might remove this, but will leave it for now
            dispatch(removeDataset(featureType));
            //dispatch addDataToMap action with new dataset
            dispatch(
              addDataToMap({
                datasets,
                options: {centerMap: true, readOnly: true},
              })
            );
          }
        }

        break;
      }

      /*
      Features in this state have been rendered. Checks the state of all FeatureTypes to see if they NEED_FILTERS.
      If so, then adds 5 filters for that FeatureType (1 for each of frequency, timeStamp, transmissionPower, label, and locality).

      */
      case MapFeatureState.RENDERED: {
        //loop through each feature type
        for (const featureType of Object.values(FeatureType)) {
          /*Check if filters need to be added for this FeatureType AND
          We don't want to addFilters when some featuresByType lists are
          still dirty because then the filters will be removed by removeDataset() in the LOADED case*/
          if (
            state.featuresByType[featureType].featureTypeState ===
              MapFeatureTypeState.NEEDS_FILTERS &&
            !hasDirtyFeatures(state.featuresByType)
          ) {
            //Dispatch the addFilter action 5 times (1 for each of frequency, timeStamp, transmissionPower, label, and locality)
            for (var x = 0; x < 5; ++x) {
              /*
              Dispatch addFilter with the FeatureType,
              which is also the name of the dataset
              we are attaching the filter too.
              Note that the attribute we intend to use with the filter isn't passed with addFilter.
              Here, we just ensure that that the appropriate number of filters are added to Kepler, attached to the right dataset/FeatureType (e.g. addFilter("Transmission")) and 
              worry about assigning them an attribute in FilterSliders.tsx (e.g setFilter(idx,"name","timeStamp"))
              */
              dispatch(
                addFilter(FeatureType[featureType as keyof typeof FeatureType])
              );
            }
          }
        }
        break;
      }

      case MapFeatureState.CLICKED: {
        /*
      Features in this state have been clicked on the map. A query for calling features within this feature is called with a limit.
      This feature may contain even more features than the limit and thus is put into the 'CLICKED AND LOADING' state.
      */
        //For clicked feature
        for (const clickedFeature of featuresInState) {
          //if the feature is expandable. TO BE DONE: Should be changed later with something like if isExpandable()
          const featureTypeStrategy = getFeatureTypeStrategyByName(
            clickedFeature.type!
          );
          if (featureTypeStrategy.isExpandable) {
            /*We're about to start changing things up so now time to remove all our filters. When a filter is added to the map via addFilter, keplerGl adds a filter object to its list of filters.
            Remove filter takes an number indicating the index of the filter in Kepler's filter list that is to be removed.
            */
            for (var x = state.filterCounter - 1; x >= 0; x--) {
              //
              dispatch(removeFilter(x));
            }
            //call the lazyQuery to get features within the clickedFeaturee
            getFeaturesWithin({
              variables: {
                query: {
                  withinFeatureUri: clickedFeature.uri,
                  types: featureTypeStrategy.withinFeatureTypes,
                },
                limit: LIMIT,
                offset: 0,
              },
            });
            //dispatch action that indicates that the query has been started.
            dispatch(startQuerying(clickedFeature.uri));
          }
        }
        break;
      }

      /*
      Features in this state have been clicked and querying to find features within them has already been completed once.
      The loading and finishedQuery variables are used to check if a query is still in progress. Once the query is done,
      we compare the number of features gotten from the query (latestDataCounter) to the limit we gave it. If they are equal,
      then more querying needs to be done as we need to query until we are not capped by the limit.
      The totalDataCounter tracks how many features have been received and is used to offset for the next query.

      */
      case MapFeatureState.CLICKED_AND_LOADING: {
        const finishedLoadingUris: string[] = [];

        //for each clicked-and-loading feature
        for (const clickedFeature of featuresInState) {
          //Get the loadingState of the feature
          const featureLoadingState = state.loadingState[clickedFeature.uri];
          //if the queryInProgress loadingState of the loadingState indicates that a query is still ongoing
          if (featureLoadingState.queryInProgress) {
            //Stop doing stuff. We shouldn't start another query while one is still ongoing!
            break;
          }

          //A query is not in progress AND if the length of the previous query was capped by the limit variable that was passed...
          if (
            featureLoadingState.latestQueryLength === LIMIT &&
            (featureLoadingState.offset < DEBUG_FEATURES_MAX || !DEBUG)
          ) {
            console.log("Made it here");
            //Same lazyQuery as in the CLICKED state, we are simply going further
            getFeaturesWithin({
              variables: {
                query: {
                  withinFeatureUri: clickedFeature.uri,
                },

                limit: LIMIT,
                offset: featureLoadingState.offset,
              },
            });
            //This will set the queryInprogress in loadingState of the feature to 'true' again.
            dispatch(repeatQuery(clickedFeature.uri));
            //If the length of the results of the query were not capped by the limited. That indicates that there are no more feautures to query.
          } else {
            //push the feature into a list of features that have finished loading.
            finishedLoadingUris.push(clickedFeature.uri);
          }
        }
        //dispatch action to loadingState of all features that have finished loading from the redux state.
        //This dispatch was the bane of my existence for a whole day.
        //To prevent re-renders, it will only be called when the finishedLoadingUris list is populated
        if (finishedLoadingUris.length > 0)
          dispatch(finishLoad(finishedLoadingUris));
        break;
      }
    }
  }

  // Kepler.gl documentation:
  // Note that if you dispatch actions such as adding data to a kepler.gl instance before the React component is mounted, the action will not be performed. Instance reducer can only handle actions when it is instantiated.
  // In other words, we need to render <KeplerGl> before we call addDataToMap, which means we need to render <KeplerGl> while the boroughs are loading.
  return (
    <div>
      <div style={{width: "100%"}}>
        <Loader loaded={!queryInProgress} />

        <ReactResizeDetector
          handleWidth
          handleHeight
          render={({width, height}) => (
            <div>
              <KeplerGl
                id="map"
                mapboxApiAccessToken="pk.eyJ1Ijoia3Jpc3RvZmVya3dhbiIsImEiOiJjazVwdzRrYm0yMGF4M2xud3Ywbmg2eTdmIn0.6KS33yQaRAC2TzWUn1Da3g"
                width={width}
              />
            </div>
          )}
        />
      </div>
    </div>
  );
};

export const Map = connect()(MapImpl);
