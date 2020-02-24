import * as React from 'react'
import {Component} from 'react'
import {connect} from 'react-redux'
import {Frame} from "twxplore/gui/geo/components/frame/Frame";
import {ActiveNavbarItem} from "twxplore/gui/geo/components/navbar/ActiveNavbarItem";
//import {FeaturesList} from "twxplore/gui/geo/components/feature/FeaturesList";
import KeplerGl from 'kepler.gl'
import { Dispatch } from 'redux';
import EditHud from '../sidebar/Sidebar'
import KeplerGlSchema from 'kepler.gl/schemas';
// Kepler.gl actions
import {addDataToMap} from 'kepler.gl/actions';
// Kepler.gl Data processing APIs
import Processors from 'kepler.gl/processors';
import ReactResizeDetector from 'react-resize-detector';
import testdata from './data.csv.js';
const mockPolygonData = require('../../mockdata/polygon.json')
import { StateFromReducersMapObject } from 'redux';

const MAPBOX_TOKEN = "pk.eyJ1Ijoia3Jpc3RvZmVya3dhbiIsImEiOiJjazVwdzRrYm0yMGF4M2xud3Ywbmg2eTdmIn0.6KS33yQaRAC2TzWUn1Da3g"

class KeplerMap extends Component<{state: any, dispatch: Dispatch<any> }> {
    componentDidMount () {
      console.log(this.props)
      let data = Processors.processCsvData(testdata)
      console.log(mockPolygonData)
      const polygonData = Processors.processGeojson(mockPolygonData)
      console.log(polygonData)
      data += polygonData
      const dataset = {
        data: polygonData,
        info: {
          id: 'test'
        }
      }
      this.props.dispatch(addDataToMap({ datasets: dataset, options: {centerMap: true, readOnly: true}}))
    }  

    render () {
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
              <EditHud/>
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
    )
  }
}    

const mapStateToProps = (state:any) => state;
const dispatchToProps = (dispatch:any) => ({dispatch});

export default connect(mapStateToProps, dispatchToProps)(KeplerMap);
