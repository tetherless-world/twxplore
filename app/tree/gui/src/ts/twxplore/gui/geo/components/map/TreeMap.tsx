import * as React from 'react'
import {useEffect, useState} from 'react'
import {Frame} from "twxplore/gui/geo/components/frame/Frame";
import {ActiveNavbarItem} from "twxplore/gui/geo/components/navbar/ActiveNavbarItem";
import KeplerGl from 'kepler.gl'
import {addDataToMap} from 'kepler.gl/actions';
import Processors from 'kepler.gl/processors';
import ReactResizeDetector from 'react-resize-detector';
import * as blckQuery from "twxplore/gui/geo/api/queries/BlocksByNtaQuery.graphql";
import * as brghQuery from "twxplore/gui/geo/api/queries/BoroughGeometriesQuery.graphql";
import * as ntaQuery from "twxplore/gui/geo/api/queries/NtasByBoroughQuery.graphql";
import * as rsltQuery from "twxplore/gui/geo/api/queries/TreeMapQuery.graphql";
import {useLazyQuery, useQuery} from '@apollo/react-hooks'
import {ApolloException, FatalErrorModal} from "@tetherless-world/twxplore-base-lib";
import * as ReactLoader from "react-loader";
import {
  BlocksByNtaQuery,
  BlocksByNtaQuery_blocks_byNtaGeometry,
  BlocksByNtaQueryVariables
} from '../../api/queries/types/BlocksByNtaQuery';
import {
  SelectionHierarchyQuery,
  SelectionHierarchyQueryVariables
} from '../../api/queries/types/SelectionHierarchyQuery';
//import { BoroughsQuery, BoroughsQuery_boroughs_geometries } from '../../api/queries/types/BoroughsQuery'
//import { NtasByBoroughQuery, NtasByBoroughQueryVariables } from '../../api/queries/types/NtasByBoroughQuery'
import {BoroughsQuery, BoroughsQuery_boroughs_geometries} from '../../api/queries/types/BoroughsQuery'
import {
  NtasByBoroughQuery,
  NtasByBoroughQuery_ntas_byBoroughGeometry,
  NtasByBoroughQueryVariables
} from '../../api/queries/types/NtasByBoroughQuery'
import {
  TreeMapQuery,
  TreeMapQuery_TreesBySelection_trees,
  TreeMapQueryVariables
} from '../../api/queries/types/TreeMapQuery'
import {connect, useDispatch, useSelector} from 'react-redux'
import {RootState} from "twxplore/gui/geo/reducers/RootState";


var wkt = require('terraformer-wkt-parser');
const MAPBOX_TOKEN = "pk.eyJ1Ijoia3Jpc3RvZmVya3dhbiIsImEiOiJjazVwdzRrYm0yMGF4M2xud3Ywbmg2eTdmIn0.6KS33yQaRAC2TzWUn1Da3g"

const TreesMapImp: React.FunctionComponent = () => {
  // Redux handling
  const reduxRootState: RootState = useSelector(state => state);
  const dispatch = useDispatch();

  // Apollo queries
  //const blockQuery = useQuery<BlocksQuery, BlocksQuery_getBlockGeometries>(blckQuery, {});
  const [boroughsQuery] = useQuery<BoroughsQuery, BoroughsQuery_boroughs_geometries>(brghQuery, {});
  const [getNtasByBoroughUri, NTAQuery] = useLazyQuery<NtasByBoroughQuery, NtasByBoroughQueryVariables>(ntaQuery);
  const [getBlockHierarchy, BlockHierarchyQuery] = useLazyQuery<SelectionHierarchyQuery, SelectionHierarchyQueryVariables>(blockHierarchyQuery)
  const [getBlocksByNtaUri, BlockQuery] = useLazyQuery<BlocksByNtaQuery, BlocksByNtaQueryVariables>(blckQuery);
  const [getResult, ResultQuery] = useLazyQuery<TreeMapQuery, TreeMapQueryVariables>(rsltQuery);
  const [componentState, setComponentState] = useState({
    nta: "",
    block: "",
    tree: "",
    hierarchy: "",
  })

  /*
    EFFECTS: Apollo query that grabs the selection hiearchy of a given blockface
    (ie. the blockface's NTA, borough, city, and state) for the Selection Treeview feature
    PARAMS: blockface Uri
    RETURNS: A list of Selection Area objects, which includes:
      - the label of the current object (Manahattan)
      - the uri of the object (urn:treedata:resource:borough:1)
      - the uri of the parent area (urn:treedata:resource:city:New_York)

  */

  /*
    EFFECTS: adds geometery/polygon data points to kepler map. Used to add boroughs, NTAs,
    and blockfaces to the map
    PARAMS:
      - dataQuery: Query data result type
      - id: blockface Id associated with a given tree
      - child: indicates the child area type:
        (ie. for city, it would be borough, borough-NTA, NTA-block, block-tree, tree-"")
      - type: indicates the area type (borough, NTA, block, or tree)
    RETURN: void
  */
  const addFeatures = (features: (BoroughsQuery_boroughs_geometries | NtasByBoroughQuery_ntas_byBoroughGeometry | BlocksByNtaQuery_blocks_byNtaGeometry)[], type: String, child: String) => {
    const datasets = {
      data: Processors.processGeojson({
        "type": "FeatureCollection",
        "features": features.map(feature => {
          return {
            "type": "Feature",
            "geometry": wkt.parse(feature.geometry.wkt),
            "properties": {
              "uri": feature.uri,
              "label": feature.geometry.label,
              type,
              child
            }
          }
        })
      }),
      info: {
        id: type
      }
    }
    dispatch(addDataToMap({datasets, options: {centerMap: true, readOnly: true}}))
  }

  const addTrees = (trees: TreeMapQuery_TreesBySelection_trees[]) => {
    const datasets = {
      data: Processors.processGeojson({
        "type": "FeatureCollection",
        "features": trees.map(tree => {
          const point = "POINT (" + tree.longitude + " " + tree.latitude + ")"
          return {
            "type": "Feature",
            "geometry": wkt.parse(point),
            "properties": {
              uri: tree.uri,
              type: "tree",
              child: null
            }
          }
        })
      }),
      info: {
        id: "tree"
      }
    }
    dispatch(addDataToMap({datasets, options: {centerMap: true, readOnly: true}}))
  }

  const [boroughRendered, setBoroughRender] = useState<Boolean>(false)

  /*
    Mutex state on all renders past the initial borough render.. determining whether or
    not NTA, blockface, or trees should be rendered
  */
  const [rendering, setRenderState] = useState<Boolean>(false)

  /*
    Mutex state on the hierarchy apollo query. This hierarchy query is run
    in conjunction with the tree result query
  */
  const [hierarchyRendering, setHierarchyRenderState] = useState<Boolean>(false)

  /*
    state workaround to apollo query refetch. (refetch upon execution returns
    the result of the previous query). This state keeps the result of a given query to be used
    as comparison for the refetch function.
  */


  useEffect(() => {
    /* Acts as the controller for the map, executing queries and displaying geometries*/
    mapRender(), []
  })


  //   const mapRender = async () => {
  //     /*
  //       Initial borough query check. When the borough query returns data,
  //       the borough geometries returned are rendered on the map
  //     */
  //     if(boroughsQuery.data! && !boroughRendered) {
  //       addFeatures(boroughsQuery.data!.boroughs.geometries, reduxRootState.app.parentUri, "borough", "NTA")
  //       setBoroughRender(true)
  //     }
  //
  //     /*
  //       Checks the scope of the map. This scope changes upon user click to indicate the result child area type
  //       of what they clicked (ie. for borough thats NTA, NTA-block, block-tree).
  //
  //       If the current parentUri (the selected area's uri) is not a value pair in their respective Map types (ie boroughMap),
  //       then a query is run.
  //
  //       The mutex rendering state is set to "true", until new data is returned (then set to false).
  //       previous state is set for each return of data to record the current data results
  //       (and to prevent refetching from returning previous query results)
  //
  //       The resulting query data is added to the map (addFeatures or addTrees)
  //     */
  //     switch (reduxRootState.app.scope) {
  //       case "borough": {
  //         break;
  //       }
  //       case "NTA": {
  //         if(!(reduxRootState.app.boroughMap.has(reduxRootState.app.parentUri))){
  //           if(reduxRootState.app.boroughMap.size > 0 && !rendering){
  //             NTAQuery.refetch({uri: reduxRootState.app.parentUri})
  //             setRenderState(true)
  //           }else if(!rendering){
  //             getNtasByBoroughUri({
  //               "variables": {uri: reduxRootState.app.parentUri}
  //             })
  //             setRenderState(true)
  //           }
  //           if(NTAQuery.data! && (componentState.nta !== NTAQuery.data!.ntas.byBoroughGeometry[0].uri || componentState.nta === "")){
  //             setComponentState({
  //               ...componentState,
  //               nta: NTAQuery.data!.ntas.byBoroughGeometry[0].uri
  //             })
  //             dispatch(appendMap('boroughMap', reduxRootState.app.parentUri))
  //             setRenderState(false)
  //             addFeatures(NTAQuery.data!.ntas.byBoroughGeometry, reduxRootState.app.parentUri, "NTA", "block")
  //           }
  //         }
  //         break;
  //       }
  //       case "block": {
  //         if(!(reduxRootState.app.ntaMap.has(reduxRootState.app.parentUri)) ){
  //           if(reduxRootState.app.ntaMap.size > 0 && !rendering){
  //             BlockQuery.refetch({uri: reduxRootState.app.parentUri})
  //             setRenderState(true)
  //           }else if(!rendering){
  //             getBlocksByNtaUri({
  //               "variables": {uri: reduxRootState.app.parentUri}
  //             })
  //             setRenderState(true)
  //           }
  //           if(BlockQuery.data && (componentState.block !== BlockQuery.data!.blocks.byNtaGeometry[0].uri || componentState.block === "") ){
  //             addFeatures(BlockQuery.data!.blocks.byNtaGeometry, reduxRootState.app.parentUri, "block", "tree")
  //             setComponentState({
  //               ...componentState,
  //               block: BlockQuery.data!.blocks.byNtaGeometry[0].uri
  //             })
  //             dispatch(appendMap('ntaMap', reduxRootState.app.parentUri))
  //             dispatch({
  //               type: 'infoPanelInfo',
  //
  //             })
  //             setRenderState(false)
  //           }
  //         }
  //       }
  //       break;
  //     }
  //     // case "block": {
  //     //   if(!(reduxRootState.app.ntaMap.has(reduxRootState.app.parentUri)) ){
  //     //     //console.log("block")
  //     //     getBlocksByNtaUri({"variables": {uri: reduxRootState.app.parentUri}})
  //     //     if(BlockQuery.data){
  //     //       addFeatures(BlockQuery.data!.blocks.byNtaGeometry, "block", "tree")
  //     //       dispatch({
  //     //         type: 'appendToMap',
  //     //         map: 'ntaMap',
  //     //         uri: reduxRootState.app.parentUri
  //     //       })
  //     //       dispatch({
  //     //         type: 'infoPanelInfo',
  //     //
  //     //       })
  //     //
  //     //       if(ResultQuery.data && (componentState.tree !== ResultQuery.data!.TreesBySelection.trees[0].uri || componentState.tree === "") ){
  //     //         addTrees(ResultQuery.data!.TreesBySelection.trees, reduxRootState.app.parentUri)
  //     //         setComponentState({
  //     //           ...componentState,
  //     //           tree: ResultQuery.data!.TreesBySelection.trees[0].uri
  //     //         })
  //     //         dispatch({
  //     //           type: 'appendToMap',
  //     //           map: 'blockMap',
  //     //           uri: reduxRootState.app.parentUri
  //     //         })
  //     //         dispatch(appendMap('blockMap',reduxRootState.app.parentUri))
  //     //         dispatch(sendSelectionData(ResultQuery.data!.TreesBySelection))
  //     //         setRenderState(false)
  //     //       }
  //     //
  //     //       if(BlockHierarchyQuery.data! && (componentState.hierarchy !== BlockHierarchyQuery.data!.blocks.hierarchy[4].uri || componentState.hierarchy === "")){
  //     //         console.log(BlockHierarchyQuery.data!.blocks.hierarchy)
  //     //         setComponentState({
  //     //           ...componentState,
  //     //           hierarchy: BlockHierarchyQuery.data!.blocks.hierarchy[4].uri
  //     //         })
  //     //         dispatch({
  //     //           type: "treeHierarchy",
  //     //           treeHierarchy: BlockHierarchyQuery.data!.blocks.hierarchy
  //     //         })
  //     //         setHierarchyRenderState(false)
  //     //       }
  //     //     }
  //     //   }
  //     //   break;
  //     // }
  //     // case "tree": {
  //     //   if(!(reduxRootState.app.blockMap.has(reduxRootState.app.parentUri))){
  //     //     getResult({"variables": {selectionInput: {includeBlocks: reduxRootState.app.blocks, includeNtaList: reduxRootState.app.NTAs, excludeBlocks: [], excludeNtaList: []}}})
  //     //     if(ResultQuery.data){
  //     //       addTrees(ResultQuery.data!.TreesBySelection.trees)
  //     //       dispatch(appendMap('blockMap',reduxRootState.app.parentUri))
  //     //       dispatch(sendSelectionData(ResultQuery.data!.TreesBySelection))
  //     //       console.log(ResultQuery)
  //     //     }
  //     //   }
  //     // }
  //     // default : {
  //     // }
  //   }
  // })

  if (boroughsQuery.error) {
    return <FatalErrorModal exception={new ApolloException(boroughsQuery.error)}/>;
  } else if (boroughsQuery.loading) {
    return <ReactLoader loaded={false}/>;
  }


  return (
      <div>
        <Frame
            activeNavItem={ActiveNavbarItem.Home}
            documentTitle="Map"
            cardTitle="Features"
      >
        <div style={{width: '100%'}}>
        <ReactResizeDetector handleWidth handleHeight
          render = {({ width, height }) => (
            <div>
              <KeplerGl
                id="map"
                width= {width}
                mapboxApiAccessToken={MAPBOX_TOKEN}
                height={height}
              />
            </div>
          )}
        />
        </div>
      </Frame>
    </div>
  );
}

export const TreeMap = connect()(TreesMapImp)
