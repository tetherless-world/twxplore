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
import * as rsltQuery from "twxplore/gui/geo/api/queries/ResultsQuery.graphql";
import {useQuery, useLazyQuery} from '@apollo/react-hooks'
import {ApolloException, FatalErrorModal} from "@tetherless-world/twxplore-base-lib";
import * as ReactLoader from "react-loader";
import { BlocksByNtaQuery, BlocksByNtaQueryVariables } from '../../api/queries/types/BlocksByNtaQuery';
import { BoroughsQuery, BoroughsQuery_getBoroughGeometries } from '../../api/queries/types/BoroughsQuery'
import { NtasByBoroughQuery, NtasByBoroughQueryVariables } from '../../api/queries/types/NtasByBoroughQuery'
import { ResultsQuery, ResultsQueryVariables } from '../../api/queries/types/ResultsQuery'

var wkt = require('terraformer-wkt-parser');
const MAPBOX_TOKEN = "pk.eyJ1Ijoia3Jpc3RvZmVya3dhbiIsImEiOiJjazVwdzRrYm0yMGF4M2xud3Ywbmg2eTdmIn0.6KS33yQaRAC2TzWUn1Da3g"

export const treeMap: React.FunctionComponent<{}> = () => {
  const counter:any = useSelector(state => state);
  const dispatch = useDispatch();
  
  //const blockQuery = useQuery<BlocksQuery, BlocksQuery_getBlockGeometries>(blckQuery, {});
  const boroughQuery = useQuery<BoroughsQuery, BoroughsQuery_getBoroughGeometries>(brghQuery, {});
  
  const [getNtasByBoroughUri, NTAQuery] = useLazyQuery<NtasByBoroughQuery, NtasByBoroughQueryVariables>(ntaQuery);
  const [getBlocksByNtaUri, BlockQuery] = useLazyQuery<BlocksByNtaQuery, BlocksByNtaQueryVariables>(blckQuery);
  const [getResult, ResultQuery] = useLazyQuery<ResultsQuery, ResultsQueryVariables>(rsltQuery);
  
  function addTreeData(treeData) {
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
    console.log(featureData)
    const dataset = {
      data: Processors.processGeojson(featureData),
      info: {
        id: "tree"
      }
    }
    dispatch(addDataToMap({ datasets: dataset, options: {centerMap: true, readOnly: true}}))
  }

  async function addGeometryData(dataQuery, type: String, child: String){
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
    const featuredata = {
      "type": "FeatureCollection",
      "features": features
    }
    const dataset = {
      data: Processors.processGeojson(featuredata),
      info: {
        id: type
      }
    }
    await(dispatch(addDataToMap({ datasets: dataset, options: {centerMap: true, readOnly: true}})))
  }

  const [boroughRendered, setBoroughRender] = useState(false)
  const [ntaRendered, setNtaRender] = useState(false)
  const [blockRendered, setBlockRender] = useState(false)
  const [treeRendered, setTreeRender] = useState(false)

  useEffect(() => {
    if(boroughQuery.data! && !boroughRendered) {
      addGeometryData(boroughQuery.data!.getBoroughGeometries, "borough", "NTA")
      setBoroughRender(true)
    }
    switch (counter.app.scope) {
      case "borough": {
        break;
      }
      case "NTA": {
        if(!ntaRendered){
          getNtasByBoroughUri({"variables": {uri: counter.app.parentUri}})
          if(NTAQuery.data){
            setNtaRender(true)
            addGeometryData(NTAQuery.data!.getNtasByBoroughGeometry, "NTA", "block")
          }
        }
        break;
      }
      case "block": {
        if(!blockRendered){
          getBlocksByNtaUri({"variables": {uri: counter.app.parentUri}})
          if(BlockQuery.data){
            setBlockRender(true)
            addGeometryData(BlockQuery.data!.getBlocksByNtaGeometry, "block", "tree")
          }
        }
        break;
      }
      case "tree": {
        if(!treeRendered && counter.app.createSelection){
          getResult({"variables": {selectionInput: {includeBlocks: counter.app.blocks, includeNtaList: counter.app.NTAs, excludeBlocks: [], excludeNtaList: []}}})
          if(ResultQuery.data){
            setTreeRender(true)
            addTreeData(ResultQuery.data.getTreesBySelection!.trees)
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
