import {connect, useDispatch, useSelector} from "react-redux";
import {MapState} from "twxplore/gui/geo/states/map/MapState";
import {RootState} from "twxplore/gui/geo/states/root/RootState";
import {BoroughsQuery, BoroughsQuery_boroughs_geometries} from "twxplore/gui/geo/api/queries/types/BoroughsQuery";
import * as boroughsQueryDocument from "twxplore/gui/geo/api/queries/BoroughGeometriesQuery.graphql";
import {useQuery} from '@apollo/react-hooks'
import * as ReactLoader from "react-loader";
import * as React from 'react';
import {FatalErrorModal} from "@tetherless-world/twxplore-base-lib";
import {addMapFeatures} from "twxplore/gui/geo/actions/map/AddMapFeaturesAction";
import {MapFeatureState} from "twxplore/gui/geo/states/map/MapFeatureState";
import {MapFeatureType} from "twxplore/gui/geo/states/map/MapFeatureType";
import {MapFeature} from "twxplore/gui/geo/states/map/MapFeature";
import Processors, {addDataToMap} from "kepler.gl/*";
import KeplerGl from "kepler.gl";
import ReactResizeDetector from "react-resize-detector";
import {ActiveNavbarItem} from "twxplore/gui/geo/components/navbar/ActiveNavbarItem";
import {Frame} from "twxplore/gui/geo/components/frame/Frame";

var wkt = require('terraformer-wkt-parser');

const MapImpl: React.FunctionComponent = () => {
    const dispatch = useDispatch();
    const state: MapState = useSelector((rootState: RootState) => rootState.app.map);

    // Load boroughs on first render
    const boroughsQueryResult = useQuery<BoroughsQuery, BoroughsQuery_boroughs_geometries>(boroughsQueryDocument, {});
    if (boroughsQueryResult.loading) {
        return <ReactLoader loaded={false}/>
    } else if (boroughsQueryResult.error) {
        return <FatalErrorModal error={boroughsQueryResult.error}/>;
    }
    if (!boroughsQueryResult.data) {
        throw new EvalError(); // Invariant
    }

    if (state.features.length === 0) {
        // No tracking any features yet, add the boroughs we loaded
        dispatch(addMapFeatures(boroughsQueryResult.data.boroughs.geometries.map(boroughFeature => ({
            childType: MapFeatureType.NTA,
            geometry: boroughFeature.geometry,
            state: MapFeatureState.LOADED,
            type: MapFeatureType.BOROUGH,
            uri: boroughFeature.uri
        }))));
        return <ReactLoader loaded={false}/>;
    }

    // At least borough features have been added to the state here.

    // Organize the features by state
    const featuresByState: { [index: string]: MapFeature[] } = {};
    for (const feature of state.features) {
        const features = featuresByState[feature.state];
        if (features) {
            features.push(feature);
        } else {
            featuresByState[feature.state] = [feature];
        }
    }

    for (const featureState in featuresByState) {
        const featuresInState = featuresByState[featureState];
        switch (featureState) {
            case MapFeatureState.LOADED: {
                const datasets = {
                    data: Processors.processGeojson({
                        "type": "FeatureCollection",
                        "features": featuresInState.map(feature => {
                            return {
                                "type": "Feature",
                                "geometry": wkt.parse(feature.geometry.wkt),
                                "internal": feature
                            }
                        })
                    }),
                    // info: {
                    //     id: type
                    // }
                }
                dispatch(addDataToMap({datasets, options: {centerMap: true, readOnly: true}}));
                break;
            }
        }
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
        </div>);
};

export const Map = connect()(MapImpl)
