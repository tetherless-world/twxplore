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
import { TreeMapQuery, TreeMapQueryVariables } from '../../api/queries/types/TreeMapQuery'

var wkt = require('terraformer-wkt-parser');
const MAPBOX_TOKEN = "pk.eyJ1Ijoia3Jpc3RvZmVya3dhbiIsImEiOiJjazVwdzRrYm0yMGF4M2xud3Ywbmg2eTdmIn0.6KS33yQaRAC2TzWUn1Da3g"

export const TreeMap: React.FunctionComponent<{}> = () => {
  const counter:any = useSelector(state => state);
  const dispatch = useDispatch();
  
  //const blockQuery = useQuery<BlocksQuery, BlocksQuery_getBlockGeometries>(blckQuery, {});
  const boroughQuery = useQuery<BoroughsQuery, BoroughsQuery_boroughs_geometries>(brghQuery, {});
  
  const [getNtasByBoroughUri, NTAQuery] = useLazyQuery<NtasByBoroughQuery, NtasByBoroughQueryVariables>(ntaQuery)
  const [getBlocksByNtaUri, BlockQuery] = useLazyQuery<BlocksByNtaQuery, BlocksByNtaQueryVariables>(blckQuery);
  const [getResult, ResultQuery] = useLazyQuery<TreeMapQuery, TreeMapQueryVariables>(rsltQuery);
  const [getBlockHierarchy, BlockHierarchyQuery] = useLazyQuery<SelectionHierarchyQuery, SelectionHierarchyQueryVariables>(blckHrchyQuery)

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

  const addGeometryData = async (dataQuery, id: String, type: String, child: String) => {
    
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
      }
    }
    //setFeature(dataset)
    dispatch(addDataToMap({ datasets: dataset, options: {centerMap: true, readOnly: true}}))
  }

  const [boroughRendered, setBoroughRender] = useState<Boolean>(false)
  const [rendering, setRenderState] = useState<Boolean>(false)
  const [hierarchyRendering, setHierarchyRenderState] = useState<Boolean>(false)
  const [previousState, setPreviousState] = useState({
    nta: "",
    block: "",
    tree: "",
    hierarchy: ""
  })
  

  useEffect(()=> {
    mapRender()
  })

    const mapRender = async () => {
      if(boroughQuery.data! && !boroughRendered) {
        addGeometryData(boroughQuery.data!.boroughs.geometries, counter.app.parentUri, "borough", "NTA")
        setBoroughRender(true)
      }
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
