import {addDataToMap, removeDataset} from "kepler.gl/actions";
import {connect, useDispatch, useSelector} from "react-redux";
import * as featuresQueryDocument from "twxplore/gui/geo/api/queries/MapFeaturesQuery.graphql";
import {RootState} from "../../states/root/RootState";
import {MapState} from "../../states/map/MapState";
import {
  MapFeaturesQuery,
  MapFeaturesQueryVariables,
} from "../../api/queries/types/MapFeaturesQuery";
import {useQuery, useLazyQuery} from "@apollo/react-hooks";
import {addMapFeatures} from "../../actions/map/AddMapFeaturesAction";
import {MapFeatureState} from "../../states/map/MapFeatureState";
import Processors from "kepler.gl/processors";
import KeplerGl from "kepler.gl";
import ReactResizeDetector from "react-resize-detector";
import * as React from "react";
import {FeatureType} from "../../api/graphqlGlobalTypes";
import {finishLoad} from "../../actions/map/FinishLoadAction";
import {FilterPanel} from "../filterPanel/FilterPanel";
import {getFeaturesByState} from "../../selectors/getFeaturesByState";
import {MapFeature} from "../../states/map/MapFeature";
import {addFilter} from "../../actions/map/AddFilterAction";
import {completedQuery} from "../../actions/map/CompletedQueryAction";
import {startQuerying} from "../../actions/map/StartQueryingAction";

const limit = 50;
var wkt = require("terraformer-wkt-parser");
const MapImpl: React.FunctionComponent = () => {
  //const logger: Logger = React.useContext(LoggerContext);
  const dispatch = useDispatch();

  const state: MapState = useSelector(
    (rootState: RootState) => rootState.app.map
  );
  /*
  const getMapConfig = () => {
    // retrieve kepler.gl store
    const keplerGl: any = useSelector(
      (rootState: RootState) => rootState.keplerGl
    );

    const {map} = keplerGl;

    // create the config object
    return KeplerGlSchema.getConfigToSave(map);
  };
*/
  // Load features on first render
  const initialFeaturesQueryResult = useQuery<
    MapFeaturesQuery,
    MapFeaturesQueryVariables
  >(featuresQueryDocument, {variables: {query: {types: [FeatureType.State]}}});

  // LazyQuery to get features within a feature.
  const [getFeaturesWithin, {loading, variables}] = useLazyQuery<
    MapFeaturesQuery,
    MapFeaturesQueryVariables
  >(featuresQueryDocument, {
    onCompleted: (data: MapFeaturesQuery) => {
      //dispatch an action to reflect a query just finishing. The loadingState for the query will be updated
      dispatch(
        completedQuery(variables.query.withinFeatureUri!, data.features.length)
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
  console.log(loading);
  //if there are no states loaded
  if (state.features.length === 0) {
    //if the data variable has been loaded
    if (initialFeaturesQueryResult.data) {
      // Not tracking any features yet, add the boroughs we loaded
      dispatch(
        addMapFeatures(
          initialFeaturesQueryResult.data.features.map(feature => ({
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

  // Organize the features by state
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
            const dirtyLoaded = state.featuresByType[featureType].features;
            //const newLoaded = [...oldLoaded, ...featuresInState];

            //create new dataset with
            const datasets = {
              data: Processors.processGeojson({
                type: "FeatureCollection",
                features: dirtyLoaded.map(feature => {
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
      Features in this state have been rendered. In the process of them being added to the map,
      the variable 'needsFilter' of the appropriate type has been set to true if this was the first time a 
      feature of that type was added to the map.
      The step here is to check what filters need to be added and call addFilter if neccessary.
      */
      case MapFeatureState.RENDERED: {
        //loop through each feature type
        for (const featureType of Object.values(FeatureType)) {
          //Check the needsFilters variable that indicates a featureType is being
          //added to the map for the first time and therefore needs filters added.
          if (state.featuresByType[featureType].needsFilters) {
            //Dispatch the addFilter action 3 times because there are 3 attributes for each type to consider
            for (var x = 0; x < 3; ++x) {
              /*
              Dispatch addFilter with the type of the feature,
              which is also, more importantly, the name of the dataset
              we are attaching the filter too.
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
          //if the feature is expandable. Should be changed later with something like if isExpandable()
          if (clickedFeature.type !== FeatureType.Transmission) {
            //call the lazyQuery to get feautres with the clickedFeaturee
            getFeaturesWithin({
              variables: {
                query: {
                  withinFeatureUri: clickedFeature.uri,
                },
                limit,
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

          //A query is not in progress. If the length of the previous query was capped by the limit variable that was passed...
          if (featureLoadingState.latestQueryLength === limit) {
            console.log("Made it here");
            //Same lazyQuery as in the CLICKED state, we are simply going further
            getFeaturesWithin({
              variables: {
                query: {
                  withinFeatureUri: clickedFeature.uri,
                },

                limit,
                offset: featureLoadingState.offset,
              },
            });
            //If the length of the results of the query were not capped by the limited. That indicates that there are no more feautures to query.
          } else {
            //push the feature into a list of features that have finished loading.
            finishedLoadingUris.push(clickedFeature.uri);
          }
        }
        //dispatch action to loadingState of all features that have finished loading from the redux state.
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
        <ReactResizeDetector
          handleWidth
          handleHeight
          render={({width, height}) => (
            <div>
              <KeplerGl
                id="map"
                width={width}
                mapboxApiAccessToken="pk.eyJ1Ijoia3Jpc3RvZmVya3dhbiIsImEiOiJjazVwdzRrYm0yMGF4M2xud3Ywbmg2eTdmIn0.6KS33yQaRAC2TzWUn1Da3g"
                height={height}
              />
            </div>
          )}
        />
      </div>
      <div>
        <FilterPanel />
      </div>
    </div>
  );
};

export const Map = connect()(MapImpl);
