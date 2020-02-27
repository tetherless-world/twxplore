
import {Component} from 'react'


class KeplerMap extends Component<{}> {
  /*
    componentDidMount () {{}
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
  */
}    

export default KeplerMap