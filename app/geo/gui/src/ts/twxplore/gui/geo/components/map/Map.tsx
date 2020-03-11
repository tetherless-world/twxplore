import {addDataToMap} from "kepler.gl/actions";
import {connect, useDispatch, useSelector} from "react-redux";
import * as featuresQueryDocument from "twxplore/gui/geo/api/queries/FeaturesQuery.graphql";
import { RootState } from "../../states/root/RootState";
import { MapState } from "../../states/map/MapState";
import { FeaturesQuery, FeaturesQueryVariables } from "../../api/queries/types/FeaturesQuery";
import {useQuery} from "@apollo/react-hooks";
import { addMapFeatures } from "../../actions/map/AddMapFeaturesAction";
import { MapFeatureState } from "../../states/map/MapFeatureState";
import { MapFeature } from "../../states/map/MapFeature";
import Processors from "kepler.gl/processors";
import KeplerGl from "kepler.gl";
import ReactResizeDetector from "react-resize-detector";
import { ActiveNavbarItem } from "../navbar/ActiveNavbarItem";
import * as React from "react";
import { Frame } from "../frame/Frame";
import { FeatureType } from "../../api/graphqlGlobalTypes";

var wkt = require("terraformer-wkt-parser");
const MapImpl: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const state: MapState = useSelector(
    (rootState: RootState) => rootState.app.map
  );
  // Load features on first render
  const featuresQueryResult = useQuery<FeaturesQuery, FeaturesQueryVariables>(
    featuresQueryDocument, 
    {variables: {aLimit: 10, aOffset: 0, aQuery: {type: FeatureType.State}},
}
  );
  console.log(featuresQueryResult);


  if (state.features.length === 0) {
    if (featuresQueryResult.data) {
      // Not tracking any features yet, add the boroughs we loaded
      dispatch(
        addMapFeatures(
          featuresQueryResult.data.features.map(feature => ({
            __typename: feature.__typename,
            geometry: feature.geometry,
            label: feature.label,
            type: feature.type,
            uri: feature.uri,
            state: MapFeatureState.LOADED,
          }))
        )
      );
    }
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
  console.log(featuresByState)

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
            id: featuresInState[0].uri
          }
        };
        //console.log(datasets)
        dispatch(
          addDataToMap({datasets, options: {centerMap: true, readOnly: true}})
        );
        break;
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
