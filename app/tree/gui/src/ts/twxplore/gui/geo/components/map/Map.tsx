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

    return <div></div>;
};

export const Map = connect()(MapImpl)
