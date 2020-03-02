import * as React from 'react'
import { useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {Frame} from "twxplore/gui/geo/components/frame/Frame";
import {ActiveNavbarItem} from "twxplore/gui/geo/components/navbar/ActiveNavbarItem";
import KeplerGl from 'kepler.gl'
import {addDataToMap} from 'kepler.gl/actions';
import Processors from 'kepler.gl/processors';
import ReactResizeDetector from 'react-resize-detector';
import * as blckQuery from "twxplore/gui/geo/api/queries/BlocksByNtaQuery.graphql";
import * as blckHrchyQuery from "twxplore/gui/geo/api/queries/SelectionHierarchyQuery.graphql";
import * as brghQuery from "twxplore/gui/geo/api/queries/BoroughGeometriesQuery.graphql";
import * as ntaQuery from "twxplore/gui/geo/api/queries/NtasByBoroughQuery.graphql";
import * as rsltQuery from "twxplore/gui/geo/api/queries/TreeMapQuery.graphql";
import {useQuery, useLazyQuery} from '@apollo/react-hooks'
import {ApolloException, FatalErrorModal} from "@tetherless-world/twxplore-base-lib";
import * as ReactLoader from "react-loader";
import { BlocksByNtaQuery, BlocksByNtaQueryVariables } from '../../api/queries/types/BlocksByNtaQuery';
import { SelectionHierarchyQuery, SelectionHierarchyQueryVariables } from  '../../api/queries/types/SelectionHierarchyQuery';
import { BoroughsQuery, BoroughsQuery_boroughs_geometries } from '../../api/queries/types/BoroughsQuery'
import { NtasByBoroughQuery, NtasByBoroughQueryVariables } from '../../api/queries/types/NtasByBoroughQuery'
import { TreeMapQuery, TreeMapQueryVariables, TreeMapQuery_TreesBySelection } from '../../api/queries/types/TreeMapQuery'
import {sendSelectionData, sendAppendMap, APPEND_MAP,SELECTION_DATA, ActionTypes} from 'twxplore/gui/geo/actions/Actions'

var wkt = require('terraformer-wkt-parser');
const MAPBOX_TOKEN = "pk.eyJ1Ijoia3Jpc3RvZmVya3dhbiIsImEiOiJjazVwdzRrYm0yMGF4M2xud3Ywbmg2eTdmIn0.6KS33yQaRAC2TzWUn1Da3g"

export const TreeMap: React.FunctionComponent<{}> = () => {
  const counter:any = useSelector(state => state);
  const dispatch = useDispatch();
  
  /* 
    Apollo query that grabs all borough geometries in database. 
    It is run immediately after the component is rendered 
  */
  const boroughQuery = useQuery<BoroughsQuery, BoroughsQuery_boroughs_geometries>(brghQuery, {});
  

  /* 
    Apollo query that grabs all the NTAs (Neighborhood Tract Areas ie. 
    Lincoln Square, Manahattanville, Clinton Park) based off a specific borough area 
    which the user selects (ie. Manahattan)
  */
  const [getNtasByBoroughUri, NTAQuery] = useLazyQuery<NtasByBoroughQuery, NtasByBoroughQueryVariables>(ntaQuery)
  

  /* 
    Apollo query that grabs all the blockfaces (streets in the map represented by 6 digit IDs) 
    based off a specific NTA area which the user selects (ie. Lincoln Square)
  */
  const [getBlocksByNtaUri, BlockQuery] = useLazyQuery<BlocksByNtaQuery, BlocksByNtaQueryVariables>(blckQuery);


  /* 
    EFFECTS: Apollo query that grabs all trees in a given blockface, as well as all associated information
    to those trees. 
    PARAMS: It takes in a list of blockface uris, NTA uris, excluded blockface uris, 
    and excluded NTA uris.
    RETURNS: A tree selection object, which includes:
      - A list of tree objects
      - the city object
      - the state object
      - A list of borough objects
      - A list of NTA objects
      - A list of blockface objects
      - A list of Zipcity objects
      - A list of species objects
      - A list of postalcode objects
      - A list of census tract objects
        ../../api/queries/types/TreeMapQuery (for more info)
  */
  const [getResult, ResultQuery] = useLazyQuery<TreeMapQuery, TreeMapQueryVariables>(rsltQuery);

  
  /*
    EFFECTS: Apollo query that grabs the selection hiearchy of a given blockface 
    (ie. the blockface's NTA, borough, city, and state) for the Selection Treeview feature
    PARAMS: blockface Uri
    RETURNS: A list of Selection Area objects, which includes: 
      - the label of the current object (Manahattan)
      - the uri of the object (urn:treedata:resource:borough:1)
      - the uri of the parent area (urn:treedata:resource:city:New_York)

  */
  const [getBlockHierarchy, BlockHierarchyQuery] = useLazyQuery<SelectionHierarchyQuery, SelectionHierarchyQueryVariables>(blckHrchyQuery)


  /* 
    EFFECTS: adds tree data points to kepler map. 
    PARAMS: 
      - treeData: Query data result type
      - id: blockface Id associated with a given tree 
    RETURN: void
  */
  const addTreeData = (treeData, id: String) => {
    const trees = treeData.map(tree => {
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
    const featureData = {
      "type": "FeatureCollection",
      "features": trees
    }
    const dataset = {
      data: Processors.processGeojson(featureData),
      info: {
        id: "tree:" + id.toString()
      }
    }
    dispatch(addDataToMap({ datasets: dataset, options: {centerMap: true, readOnly: true}}))
  }

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
  const addGeometryData = async (dataQuery:string, id: String, type: String, child: String) => {
    
    const features = dataQuery.map(feature => {
      console.log(feature)
      return {
        "type": "Feature",
        "geometry": wkt.parse(feature.geometry.wkt),
        "properties": {
          "uri": feature.uri,
          "label": feature.geometry.label,
          "type": type,
          "child": child
        }
      }
    })
    const featuredata = {
      "type": "FeatureCollection",
      "features": features
    }
    console.log(featuredata)
    const dataset = {
      data: Processors.processGeojson(featuredata),
      info: {
        label: id.toString(),
        id: type + id.toString(),
      },
    }
    //setFeature(dataset)
    dispatch(addDataToMap({ 
      datasets: dataset, 
      options: {centerMap: true, readOnly: true, keepExistingConfig: false},
      config: {
        visState: {
          layers: [{
            'type': 'multipolygon',
            'config': {
              dataId: type + id.toString(),
              isVisible: false,
              visConfig: {
                opacity: 0
              }
            }
          }]
        }
      }
    }))
  }

  /* Mutex state on borough.. determining whether or not the borough should be rendered */
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
  const [previousState, setPreviousState] = useState({
    nta: "",
    block: "",
    tree: "",
    hierarchy: ""
  })
  

  useEffect(()=> {
    /* Acts as the controller for the map, executing queries and displaying geometries*/
    mapRender()
  })

    const mapRender = async () => {
      /* 
        Initial borough query check. When the borough query returns data, 
        the borough geometries returned are rendered on the map 
      */
      if(boroughQuery.data! && !boroughRendered) {
        addGeometryData(boroughQuery.data!.boroughs.geometries, counter.app.parentUri, "borough", "NTA")
        setBoroughRender(true)
      }

      /* 
        Checks the scope of the map. This scope changes upon user click to indicate the result child area type 
        of what they clicked (ie. for borough thats NTA, NTA-block, block-tree).
       
        If the current parentUri (the selected area's uri) is not a value pair in their respective Map types (ie boroughMap),
        then a query is run. 
        
        The mutex rendering state is set to "true", until new data is returned (then set to false).
        previous state is set for each return of data to record the current data results 
        (and to prevent refetching from returning previous query results)

        The resulting query data is added to the map (addGeometryData or addTreeData)
      */
      switch (counter.app.scope) {
        case "borough": {
          break;
        }
        case "NTA": {
          if(!(counter.app.boroughMap.has(counter.app.parentUri))){
            if(counter.app.boroughMap.size > 0 && !rendering){
              NTAQuery.refetch({uri: counter.app.parentUri})
              setRenderState(true)
            }else if(!rendering){ 
              getNtasByBoroughUri({
                "variables": {uri: counter.app.parentUri}
              })
              setRenderState(true)
            }
            if(NTAQuery.data! && (previousState.nta !== NTAQuery.data!.ntas.byBoroughGeometry[0].uri || previousState.nta === "")){
              setPreviousState({
                ...previousState,
                nta: NTAQuery.data!.ntas.byBoroughGeometry[0].uri
              })
              dispatch({
                type: 'appendToMap', 
                map: 'boroughMap',
                uri: counter.app.parentUri
              })
              setRenderState(false)
              addGeometryData(NTAQuery.data!.ntas.byBoroughGeometry, counter.app.parentUri, "NTA", "block")
            }
          }
          break;
        }
        case "block": {
          if(!(counter.app.ntaMap.has(counter.app.parentUri)) ){
            if(counter.app.ntaMap.size > 0 && !rendering){
              BlockQuery.refetch({uri: counter.app.parentUri})
              setRenderState(true)
            }else if(!rendering){ 
              getBlocksByNtaUri({
                "variables": {uri: counter.app.parentUri}
              })
              setRenderState(true)
            }
            if(BlockQuery.data && (previousState.block !== BlockQuery.data!.blocks.byNtaGeometry[0].uri || previousState.block === "") ){
              addGeometryData(BlockQuery.data!.blocks.byNtaGeometry, counter.app.parentUri, "block", "tree")
              setPreviousState({
                ...previousState,
                block: BlockQuery.data!.blocks.byNtaGeometry[0].uri
              })
              dispatch({
                type: 'appendToMap', 
                map: 'ntaMap',
                uri: counter.app.parentUri
              })
              setRenderState(false)
            }
          }
          break;
        }
        case "tree": {
          if(!(counter.app.blockMap.has(counter.app.parentUri))){
            if(counter.app.blockMap.size > 0 && !rendering && !hierarchyRendering){
              ResultQuery.refetch({selectionInput: {includeBlocks: [counter.app.parentUri], includeNtaList: counter.app.NTAs, excludeBlocks: [], excludeNtaList: []}})
              BlockHierarchyQuery.refetch({uri: counter.app.parentUri})
              setRenderState(true)
              setHierarchyRenderState(true)
            }else if(!rendering && !hierarchyRendering){ 
              getResult({"variables": {selectionInput: {includeBlocks: counter.app.blocks, includeNtaList: counter.app.NTAs, excludeBlocks: [], excludeNtaList: []}}})
              getBlockHierarchy({"variables": {uri: counter.app.parentUri}})
              setRenderState(true)
              setHierarchyRenderState(true)
            }
            
            if(ResultQuery.data && (previousState.tree !== ResultQuery.data!.TreesBySelection.trees[0].uri || previousState.tree === "") ){
              addTreeData(ResultQuery.data!.TreesBySelection.trees, counter.app.parentUri)
              setPreviousState({
                ...previousState,
                tree: ResultQuery.data!.TreesBySelection.trees[0].uri
              })
              dispatch({
                type: 'appendToMap', 
                map: 'blockMap',
                uri: counter.app.parentUri
              })
              dispatch(sendAppendMap('blockMap',counter.app.parentUri))
              dispatch(sendSelectionData(ResultQuery.data!.TreesBySelection))
              setRenderState(false)
            }

            if(BlockHierarchyQuery.data! && (previousState.hierarchy !== BlockHierarchyQuery.data!.blocks.hierarchy[4].uri || previousState.hierarchy === "")){
              console.log(BlockHierarchyQuery.data!.blocks.hierarchy)
              setPreviousState({
                ...previousState,
                hierarchy: BlockHierarchyQuery.data!.blocks.hierarchy[4].uri
              })
              dispatch({
                type: "treeHierarchy",
                treeHierarchy: BlockHierarchyQuery.data!.blocks.hierarchy
              })
              setHierarchyRenderState(false)
            }
          }
        }
        default : {
        }
      }
    }

  /* intial loading bar for borough query */
  if (boroughQuery.error) {
    return <FatalErrorModal exception={new ApolloException(boroughQuery.error)}/>;
  } else if (boroughQuery.loading) {
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
