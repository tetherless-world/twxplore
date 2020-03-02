import * as React from 'react'
import { useState, useEffect } from 'react'
import {useSelector, useDispatch} from 'react-redux'
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
import {useQuery, useLazyQuery} from '@apollo/react-hooks'
import {ApolloException, FatalErrorModal} from "@tetherless-world/twxplore-base-lib";
import * as ReactLoader from "react-loader";
import { BlocksByNtaQuery, BlocksByNtaQueryVariables } from '../../api/queries/types/BlocksByNtaQuery';
import { BoroughsQuery, BoroughsQuery_boroughs_geometries } from '../../api/queries/types/BoroughsQuery'
import { NtasByBoroughQuery, NtasByBoroughQueryVariables } from '../../api/queries/types/NtasByBoroughQuery'
import { TreeMapQuery, TreeMapQueryVariables, TreeMapQuery_TreesBySelection } from '../../api/queries/types/TreeMapQuery'
import {sendSelectionData, sendAppendMap, APPEND_MAP,SELECTION_DATA, ActionTypes} from 'twxplore/gui/geo/actions/Actions'

var wkt = require('terraformer-wkt-parser');
const MAPBOX_TOKEN = "pk.eyJ1Ijoia3Jpc3RvZmVya3dhbiIsImEiOiJjazVwdzRrYm0yMGF4M2xud3Ywbmg2eTdmIn0.6KS33yQaRAC2TzWUn1Da3g"

export const treeMap: React.FunctionComponent<{}> = () => {
  const counter:any = useSelector(state => state);
  const dispatch = useDispatch();
  
  //const blockQuery = useQuery<BlocksQuery, BlocksQuery_getBlockGeometries>(blckQuery, {});
  const boroughQuery = useQuery<BoroughsQuery, BoroughsQuery_boroughs_geometries>(brghQuery, {});
  
  const [getNtasByBoroughUri, NTAQuery] = useLazyQuery<NtasByBoroughQuery, NtasByBoroughQueryVariables>(ntaQuery);
  const [getBlocksByNtaUri, BlockQuery] = useLazyQuery<BlocksByNtaQuery, BlocksByNtaQueryVariables>(blckQuery);
  const [getResult, ResultQuery] = useLazyQuery<TreeMapQuery, TreeMapQueryVariables>(rsltQuery);
  
  const addTreeData = (treeData:string) => {
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
    //console.log(featureData)
    const dataset = {
      data: Processors.processGeojson(featureData),
      info: {
        id: "tree"
      }
    }
    dispatch(addDataToMap({ datasets: dataset, options: {centerMap: true, readOnly: true}}))
  }

  const addGeometryData = (dataQuery:string, type: String, child: String) => {
    const features = dataQuery.map(feature => {
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
    console.log(features)
    const featuredata = {
      "type": "FeatureCollection",
      "features": features
    }
    console.log(featuredata)
    const dataset = {
      data: Processors.processGeojson(featuredata),
      info: {
        id: type
      }
    }
    dispatch(addDataToMap({ datasets: dataset, options: {centerMap: true, readOnly: true}}))
  }

  const [boroughRendered, setBoroughRender] = useState<Boolean>(false)

  useEffect(() => {
    if(boroughQuery.data! && !boroughRendered) {
      addGeometryData(boroughQuery.data!.boroughs.geometries, "borough", "NTA")
      setBoroughRender(true)
    }
    switch (counter.app.scope) {
      case "borough": {
        break;
      }
      case "NTA": {
        if(!(counter.app.boroughMap.has(counter.app.parentUri))){
          //console.log("NTA")
          getNtasByBoroughUri({"variables": {uri: counter.app.parentUri}})
          if(NTAQuery.data){
            addGeometryData(NTAQuery.data!.ntas.byBoroughGeometry, "NTA", "block")
            dispatch({
              type: 'appendToMap', 
              map: 'boroughMap',
              uri: counter.app.parentUri
            })
          }
        }
        break;
      }
      case "block": {
        if(!(counter.app.ntaMap.has(counter.app.parentUri)) ){
          //console.log("block")
          getBlocksByNtaUri({"variables": {uri: counter.app.parentUri}})
          if(BlockQuery.data){
            addGeometryData(BlockQuery.data!.blocks.byNtaGeometry, "block", "tree")
            dispatch({
              type: 'appendToMap', 
              map: 'ntaMap',
              uri: counter.app.parentUri
            })
            dispatch({
              type: 'infoPanelInfo', 

            })
            
          }
        }
        break;
      }
      case "tree": {
        if(!(counter.app.blockMap.has(counter.app.parentUri))){
          getResult({"variables": {selectionInput: {includeBlocks: counter.app.blocks, includeNtaList: counter.app.NTAs, excludeBlocks: [], excludeNtaList: []}}})
          if(ResultQuery.data){
            addTreeData(ResultQuery.data!.TreesBySelection.trees)
            dispatch(sendAppendMap('blockMap',counter.app.parentUri))
            dispatch(sendSelectionData(ResultQuery.data!.TreesBySelection))
            console.log(ResultQuery)
          }
        }
      }
      default : {
      }
    }
  })  
  
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
