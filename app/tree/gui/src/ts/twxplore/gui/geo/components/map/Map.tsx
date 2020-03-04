import {connect, useDispatch, useSelector} from "react-redux";
import {MapState} from "twxplore/gui/geo/states/map/MapState";
import {RootState} from "twxplore/gui/geo/states/root/RootState";
import {BoroughsQuery, BoroughsQuery_boroughs_geometries} from "twxplore/gui/geo/api/queries/types/BoroughsQuery";
import * as boroughsQueryDocument from "twxplore/gui/geo/api/queries/BoroughGeometriesQuery.graphql";
import {useQuery} from '@apollo/react-hooks'
import * as ReactLoader from "react-loader";
import * as React from 'react';
import {FatalErrorModal} from "@tetherless-world/twxplore-base-lib";

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

    return <div></div>;
};

export const Map = connect()(MapImpl)
