import {connect, useDispatch, useSelector} from "react-redux";
import {MapState} from "twxplore/gui/tree/states/map/MapState";
import {RootState} from "twxplore/gui/tree/states/root/RootState";
import {BoroughsQuery} from "twxplore/gui/tree/api/queries/types/BoroughsQuery";
import {
  NtasByBoroughQuery,
  NtasByBoroughQueryVariables,
} from "twxplore/gui/tree/api/queries/types/NtasByBoroughQuery";
import * as boroughsQueryDocument from "twxplore/gui/tree/api/queries/BoroughGeometriesQuery.graphql";
import * as ntasByBoroughQueryDocument from "twxplore/gui/tree/api/queries/NtasByBoroughQuery.graphql";
import * as blocksbyNtaQueryDocument from "twxplore/gui/tree/api/queries/BlocksByNtaQuery.graphql";
import * as treeMapQueryDocument from "twxplore/gui/tree/api/queries/TreeMapQuery.graphql";
import {useQuery, useLazyQuery} from "@apollo/react-hooks";
import * as React from "react";
import {addMapFeatures} from "twxplore/gui/tree/actions/map/AddMapFeaturesAction";
import {MapFeatureState} from "twxplore/gui/tree/states/map/MapFeatureState";
import {MapFeatureType} from "twxplore/gui/tree/states/map/MapFeatureType";
import {MapFeature} from "twxplore/gui/tree/states/map/MapFeature";
import {addDataToMap} from "kepler.gl/actions";
import Processors from "kepler.gl/processors";
import KeplerGl from "kepler.gl";
import ReactResizeDetector from "react-resize-detector";
import {ActiveNavbarItem} from "twxplore/gui/tree/components/navbar/ActiveNavbarItem";
import {Frame} from "twxplore/gui/tree/components/frame/Frame";
import {changeMapFeatureState} from "../../actions/map/ChangeMapFeatureStateAction";
import {
  BlocksByNtaQuery,
  BlocksByNtaQueryVariables,
} from "../../api/queries/types/BlocksByNtaQuery";
import {
  TreeMapQuery,
  TreeMapQueryVariables,
} from "../../api/queries/types/TreeMapQuery";

var wkt = require("terraformer-wkt-parser");

const MapImpl: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const state: MapState = useSelector(
    (rootState: RootState) => rootState.app.map
  );
  // Load boroughs on first render
  const boroughsQueryResult = useQuery<BoroughsQuery>(
    boroughsQueryDocument,
    {}
  );

  /* Lazy Query to get Ntas that belong to a borough.
  The onCompleted function dispatches an action that
  puts each nta from the query into the feature list
  on the state with a feature-state of 'LOADED'
  */
  const [getNtasByBorough, {}] = useLazyQuery<
    NtasByBoroughQuery,
    NtasByBoroughQueryVariables
  >(ntasByBoroughQueryDocument, {
    onCompleted: (data: NtasByBoroughQuery) => {
      dispatch(
        addMapFeatures(
          data.ntas.byBoroughGeometry.map(ntaFeature => ({
            childType: MapFeatureType.BLOCK,
            geometry: ntaFeature.geometry,
            state: MapFeatureState.LOADED,
            type: MapFeatureType.NTA,
            uri: ntaFeature.uri,
          }))
        )
      );
    },
  });

  /* Same lazy query above except to get Blocks under an Nta*/
  const [getBlocksByNta] = useLazyQuery<
    BlocksByNtaQuery,
    BlocksByNtaQueryVariables
  >(blocksbyNtaQueryDocument, {
    onCompleted: (data: BlocksByNtaQuery) => {
      dispatch(
        addMapFeatures(
          data.blocks.byNtaGeometry.map(blockFeature => ({
            childType: MapFeatureType.TREE,
            geometry: blockFeature.geometry,
            state: MapFeatureState.LOADED,
            type: MapFeatureType.BLOCK,
            uri: blockFeature.uri,
          }))
        )
      );
    },
  });

  /* This is a very comprehensive query. Takes in a filter that will specifify what info to return*/
  const [getTreeMap, {}] = useLazyQuery<TreeMapQuery, TreeMapQueryVariables>(
    treeMapQueryDocument,
    {
      onCompleted: (data: TreeMapQuery) => {
        dispatch(
          addMapFeatures(
            data.treesBySelection.trees.map(tree => ({
              geometry: wkt.parse(
                "POINT (" + tree.longitude + " " + tree.latitude + ")"
              ),
              state: MapFeatureState.LOADED,
              type: MapFeatureType.TREE,
              uri: tree.uri,
            }))
          )
        );
      },
    }
  );

  /*Function to call the getTreeMapQuery while filtering for trees in a certain block
  const getTreesByBorough = (blockUri: string ) => {
    const treeData =  getMapInfo({"variables" : {selectionInput: { includeBlocks: [blockUri], includeNtaList: [], excludeBlocks: [], excludeNtaList: [] }}})
    dispatch(
      addMapFeatures(
        treeData.trees   data.boroughs.geometries.map(boroughFeature => ({
          childType: MapFeatureType.NTA,
          geometry: boroughFeature.geometry,
          state: MapFeatureState.LOADED,
          type: MapFeatureType.BOROUGH,
          uri: boroughFeature.uri,
        }))
      )
    );
  }
*/

  if (state.features.length === 0) {
    if (boroughsQueryResult.data) {
      // Not tracking any features yet, add the boroughs we loaded
      dispatch(
        addMapFeatures(
          boroughsQueryResult.data.boroughs.geometries.map(boroughFeature => ({
            childType: MapFeatureType.NTA,
            geometry: boroughFeature.geometry,
            state: MapFeatureState.LOADED,
            type: MapFeatureType.BOROUGH,
            uri: boroughFeature.uri,
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

  // Feature state machine
  for (const featureState in featuresByState) {
    const featuresInState = featuresByState[featureState];
    switch (featureState) {
      case MapFeatureState.LOADED: {
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
            id: featuresInState[0].uri,
          },
        };
        dispatch(
          addDataToMap({datasets, options: {centerMap: true, readOnly: true}})
        );
        break;
      }
      case MapFeatureState.CLICKED: {
        for (const clickedFeature of featuresInState) {
          if (clickedFeature.type === MapFeatureType.BOROUGH) {
            //A borough was clicked. Query for ntas within that borough
            getNtasByBorough({variables: {uri: clickedFeature.uri}});
          } else if (clickedFeature.type === MapFeatureType.NTA) {
            getBlocksByNta({variables: {uri: clickedFeature.uri}});
          } else if (clickedFeature.type === MapFeatureType.BLOCK) {
            getTreeMap({
              variables: {
                selectionInput: {
                  includeBlocks: [clickedFeature.uri],
                  includeNtaList: [],
                  excludeBlocks: [],
                  excludeNtaList: [],
                },
              },
            });
          }

          dispatch(
            changeMapFeatureState(clickedFeature.uri, MapFeatureState.RENDERED)
          );
        }
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
