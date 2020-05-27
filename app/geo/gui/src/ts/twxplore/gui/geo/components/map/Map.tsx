import {
  addDataToMap,
  removeFilter,
  removeDataset,
  togglePerspective,
} from "kepler.gl/actions";
import {connect, useDispatch, useSelector} from "react-redux";
import * as featuresQueryDocument from "twxplore/gui/geo/api/queries/MapFeaturesQuery.graphql";
import {RootState} from "../../states/root/RootState";
import {MapState} from "../../states/map/MapState";
import {
  MapFeaturesQuery,
  MapFeaturesQueryVariables,
  MapFeaturesQuery_features_geometry_parsedWkt,
  MapFeaturesQuery_features_geometry_parsedWkt_Polygon,
  MapFeaturesQuery_features_geometry_parsedWkt_MultiPolygon,
  MapFeaturesQuery_features_geometry_parsedWkt_Point,
  //MapFeaturesQuery_features_geometry_parsedWkt_Polygon,
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
import {completedQuery} from "../../actions/map/CompletedQueryAction";
import {startQuerying} from "../../actions/map/StartQueryingAction";
import {finishLoad} from "../../actions/map/FinishLoadAction";
import {repeatQuery} from "../../actions/map/RepeatQueryAction";
import {MapFeatureTypeState} from "../../states/map/MapFeatureTypeState";
import * as _ from "lodash";
import {getFeatureTypeStrategyByName} from "../../featureTypeStrategies/getFeatureTypeStrategyByName";
import {clickRoot} from "../../actions/map/ClickRootAction";
import {addFilter} from "../../actions/map/AddFilterAction";
import {ROOT_FEATURE_URI} from "../../states/map/ROOT_FEATURE_URI";
import {Loader, Dimmer} from "semantic-ui-react";
import ReactResizeDetector from "react-resize-detector";
import {FeatureAttributeName} from "../../states/map/FeatureAttributeName";
//import KeplerGlSchema from "kepler.gl/schemas";

const LIMIT = 500;
const DEBUG = true;
const DEBUG_FEATURES_MAX = 5000;
const MapImpl: React.FunctionComponent = () => {
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
      const clickedFeatureUri = getFeaturesWithinResults.variables.query
        .withinFeatureUri
        ? getFeaturesWithinResults.variables.query.withinFeatureUri
        : ROOT_FEATURE_URI;
      //dispatch an action to reflect a query just finishing. The loadingState for the query will be updated
      dispatch(completedQuery(clickedFeatureUri, data.features.length));
      // dispatch an action to which will put the features in LOADING state and add the features to lists in the store.
      dispatch(
        addMapFeatures(
          data.features.map(feature => ({
            label: feature.label,
            uri: feature.uri,
            type: feature.type,
            locality: feature.locality,
            regions: feature.regions,
            __typename: feature.__typename,
            geometry: feature.geometry,
            frequency: feature.frequency,
            timestamp: feature.timestamp ? feature.timestamp * 1000 : null,
            postalCode: feature.postalCode,
            transmissionPower: feature.transmissionPower,
            state: MapFeatureState.LOADED,
            frequencyString: feature.frequency
              ? (
                  Math.floor((feature.frequency / 1000000) * 100) / 100
                ).toString() +
                " " +
                "MHz"
              : undefined,
            timestampString: feature.timestamp
              ? new Date(feature.timestamp * 1000).toString()
              : undefined,
            transmissionPowerString: feature.transmissionPower
              ? feature.transmissionPower.toString() + " dB"
              : undefined,
            x: (feature.geometry
              .parsedWkt as MapFeaturesQuery_features_geometry_parsedWkt_Point)
              .x,
            y: (feature.geometry
              .parsedWkt as MapFeaturesQuery_features_geometry_parsedWkt_Point)
              .y,
          }))
        )
      );
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
  });

  const pairCoordinates = (
    parsedWkt: MapFeaturesQuery_features_geometry_parsedWkt
  ) => {
    switch (parsedWkt.__typename) {
      case "Point": {
        let pointParsedWkt = parsedWkt as MapFeaturesQuery_features_geometry_parsedWkt_Point;
        return [pointParsedWkt.x, pointParsedWkt.y];
      }
      case "Polygon": {
        let polygonParsedWkt = parsedWkt as MapFeaturesQuery_features_geometry_parsedWkt_Polygon;
        return [_.chunk(polygonParsedWkt.lines[0], 2)];
      }
      case "MultiPolygon": {
        let multiPollygonParsedWkt = parsedWkt as MapFeaturesQuery_features_geometry_parsedWkt_MultiPolygon;
        const MultiPolygonArray = [];
        for (const polygon of multiPollygonParsedWkt.polygons) {
          MultiPolygonArray.push([_.chunk(polygon.lines[0], 2)]);
        }
        return MultiPolygonArray;
      }
      default: {
        throw new Error("MISTAKES");
        break;
      }
    }
  };
  //This function checks if any of the featureByTypes are 'dirty'
  const hasDirtyFeatures = Object.values(FeatureType).some(
    featureType => state.featuresByType[featureType].dirty
  );

  const queryInProgress = Object.keys(state.loadingState).some(
    clickedUri => state.loadingState[clickedUri].queryInProgress
  );
  //if there are no states loaded
  if (
    state.features.length === 1 &&
    state.features[0].state === MapFeatureState.LOADED &&
    state.features[0].uri === ROOT_FEATURE_URI
  ) {
    //if the keplerState has been initialized
    if (keplerState.map) {
      //Simulating clicking the root which starts the process of querying for the first visible feature type
      dispatch(clickRoot());
      //Toggle the map to 3d perspective
      dispatch(togglePerspective());
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
                    //geometry: wkt.parse(feature.geometry.wkt),
                    geometry: {
                      type: feature.geometry.parsedWkt.__typename,
                      coordinates: pairCoordinates(feature.geometry.parsedWkt),
                    },
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
        /*We don't want to work with rendered features when some featuresByType lists are
        still dirty because theres a chance that some filters and layers will be removed by removeDataset() in the LOADED case*/
        if (!hasDirtyFeatures)
          //loop through each feature type
          for (const featureType of Object.values(FeatureType)) {
            const featureTypeStrategy = getFeatureTypeStrategyByName(
              featureType
            );

            let attributeStatesOfFeatureType =
              state.featuresByType[featureType].attributeStates;
            let featureTypeStateOfFeatureType =
              state.featuresByType[featureType].featureTypeState;
            switch (featureTypeStateOfFeatureType) {
              //Check if filters need to be added for this FeatureType
              case MapFeatureTypeState.NEEDS_FILTERS: {
                //Dispatch the addFilter action for the number of attributes that have an 'attribute state'. If there are 5 attributes with an attribute state then 5 filters will be added.
                for (
                  var x = 0;
                  x < Object.keys(attributeStatesOfFeatureType).length;
                  ++x
                ) {
                  /*
              Dispatch addFilter with the FeatureType,
              which is also the name of the dataset
              we are attaching the filter too.
              Note that the attribute we intend to use with the filter isn't passed with addFilter.
              Here, we just ensure that that the appropriate number of filters are added to Kepler, attached to the right dataset/FeatureType (e.g. addFilter("Transmission")) and 
              worry about assigning them an attribute in FilterSliders.tsx (e.g setFilter(idx,"name","timeStamp"))
              */
                  dispatch(
                    addFilter(
                      FeatureType[featureType as keyof typeof FeatureType]
                    )
                  );
                }
                break;
              }

              /* Several cases here. The point is that when in any of these cases, let featureTypeStrategy handle what actions to dispatch.
              Right now only TransmissionFeatureTypeStrategy does a lot with this (others just use this to configure their pop-up), but this will make it possible to configure layers of different
              feature types later.
              */
              case MapFeatureTypeState.NEEDS_POPUP_CHANGE:
              case MapFeatureTypeState.NEEDS_LAYER_CHANGE:
              case MapFeatureTypeState.NEEDS_3D_ENABLED:
              case MapFeatureTypeState.NEEDS_LNG_AND_LAT:
              case MapFeatureTypeState.NEEDS_HEIGHT_ATTRIBUTE: {
                /* Get the kepler layers list as well as an index to get the keplerLayer that holds the relevant feature type.*/
                const keplerLayers = keplerState.map.visState.layers;
                const layerIndex = keplerLayers.findIndex(
                  (layer: {config: {dataId: string}}) =>
                    layer.config.dataId === featureType
                );
                const keplerLayerOfFeatureType = keplerLayers[layerIndex];

                /*Get a kepler filter of the feature type. For now we hardcode to get the transmissionPower filter*/
                const keplerFilters = keplerState.map.visState.filters;
                const keplerFilterOfFeatureType =
                  keplerFilters[
                    state.featuresByType[featureType].attributeStates[
                      FeatureAttributeName.transmissionPower
                    ].filterIndex!
                  ];

                /*Get the kepler list of fields of the feature type*/
                const keplerFieldsOfFeatureType =
                  keplerState.map.visState.datasets[featureType].fields;

                /*Get the interactionConfig of kepler. This is used to change fieldsToShowOnPopup*/
                const keplerInteractionConfig =
                  keplerState.map.visState.interactionConfig;
                keplerInteractionConfig.tooltip.config.fieldsToShow[
                  featureType
                ] = featureTypeStrategy.fieldsToShowOnPopup;

                featureTypeStrategy.dispatchLayerConfigurationActions({
                  keplerLayerOfFeatureType,
                  keplerFilterOfFeatureType,
                  keplerFieldsOfFeatureType,
                  keplerInteractionConfig,
                  featureTypeStateOfFeatureType,
                  dispatch,
                });
                break;
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
          if (featureTypeStrategy.expandable) {
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
                query: featureTypeStrategy.getClickedQuery(clickedFeature.uri),
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
          const featureTypeStrategy = getFeatureTypeStrategyByName(
            clickedFeature.type!
          );
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
                query: featureTypeStrategy.getClickedQuery(clickedFeature.uri)!,

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
      <Dimmer page active={queryInProgress || hasDirtyFeatures}>
        <Loader>{state.loadingMessage}</Loader>
      </Dimmer>
      <div style={{width: "100%"}}>
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
