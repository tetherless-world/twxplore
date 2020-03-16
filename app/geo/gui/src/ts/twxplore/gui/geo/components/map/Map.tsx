import {addDataToMap} from "kepler.gl/actions";
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
import {MapFeature} from "../../states/map/MapFeature";
import Processors from "kepler.gl/processors";
import KeplerGl from "kepler.gl";
import ReactResizeDetector from "react-resize-detector";
import {ActiveNavbarItem} from "../navbar/ActiveNavbarItem";
import * as React from "react";
import {Frame} from "../frame/Frame";
import {FeatureType} from "../../api/graphqlGlobalTypes";
import {changeMapFeatureState} from "../../actions/map/ChangeMapFeatureStateAction";

var wkt = require("terraformer-wkt-parser");
var loadCounter = 0;

const MapImpl: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const state: MapState = useSelector(
    (rootState: RootState) => rootState.app.map
  );
  console.log(state);
  // dispatch(receiveMapConfig(savedConfigV0));

  // Load features on first render
  const initialFeaturesQueryResult = useQuery<
    MapFeaturesQuery,
    MapFeaturesQueryVariables
  >(featuresQueryDocument, {variables: {query: {types: [FeatureType.State]}}});

  const [getFeaturesWithin] = useLazyQuery<
    MapFeaturesQuery,
    MapFeaturesQueryVariables
  >(featuresQueryDocument, {
    onCompleted: (data: MapFeaturesQuery) => {
      dispatch(
        addMapFeatures(
          data.features.map(feature => ({
            __typename: feature.__typename,
            geometry: feature.geometry,
            label: feature.label,
            frequency: feature.frequency,
            timestamp: feature.timestamp,
            type: feature.type,
            uri: feature.uri,
            state: MapFeatureState.LOADED,
          }))
        )
      );
      loadCounter += 1;
    },
  });

  if (state.features.length === 0) {
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
            state: MapFeatureState.LOADED,
          }))
        )
      );
    }
    loadCounter += 1;
  }

  // Organize the features by state
  const featuresByState: {[index: string]: MapFeature[]} = {};
  for (const feature of state.features) {
    const features = featuresByState[feature.state];
    if (features) {
      features.push(feature);
    } else {
      featuresByState[feature.state] = [feature];
    }
  }

  // Feature state machine
  for (const featureState in featuresByState) {
    const featuresInState = featuresByState[featureState];
    switch (featureState) {
      case MapFeatureState.LOADED: {
        /*
        Features in this state have been queried, created and pushed into the 
        features state list that is located on the store. The next step is to
        add the data of the features to the map using the addDataToMap action which is reduced by
        keplerGL reducer.. The geometry of the feature is used
        to display its location and shape on the map.
        */

        const datasets = {
          data: Processors.processGeojson({
            type: "FeatureCollection",
            features: featuresInState.map(feature => {
              return {
                type: "Feature",
                geometry: wkt.parse(feature.geometry.wkt),
                properties: feature,
              };
            }),
          }),
          info: {
            id: loadCounter.toString(),
          },
        };
        dispatch(
          addDataToMap({
            datasets,
            options: {centerMap: true, readOnly: true},
          })
        );
        break;
      }

      case MapFeatureState.CLICKED: {
        /*
      Features in this state have been clicked on the map. They now need to
      LOAD in their child features.
      */

        const clickedUris: string[] = [];
        for (const clickedFeature of featuresInState) {
          getFeaturesWithin({
            variables: {
              query: {withinFeatureUri: clickedFeature.uri},
            },
          });
          clickedUris.push(clickedFeature.uri);
        }
        dispatch(changeMapFeatureState(clickedUris, MapFeatureState.RENDERED));
      }
    }
  }

  // Kepler.gl documentation:
  // Note that if you dispatch actions such as adding data to a kepler.gl instance before the React component is mounted, the action will not be performed. Instance reducer can only handle actions when it is instantiated.
  // In other words, we need to render <KeplerGl> before we call addDataToMap, which means we need to render <KeplerGl> while the boroughs are loading.

  return (
    <div>
      <Frame
        activeNavItem={ActiveNavbarItem.Home}
        documentTitle="Map"
        cardTitle="Features"
      >
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
      </Frame>
    </div>
  );
};

export const Map = connect()(MapImpl);
