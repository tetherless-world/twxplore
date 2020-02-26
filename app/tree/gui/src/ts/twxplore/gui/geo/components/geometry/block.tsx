import * as React from "react";
import {ListGroup, ListGroupItem} from "reactstrap";
import * as query from "twxplore/gui/geo/api/queries/BlockGeometriesQuery.graphql";
import {useQuery} from '@apollo/react-hooks'
import {ApolloException, FatalErrorModal} from "@tetherless-world/twxplore-base-lib";
import * as ReactLoader from "react-loader";
import {BlocksQuery, BlocksQuery_getBlockGeometries} from "twxplore/gui/geo/api/queries/types/BlocksQuery";

export const Block: React.FunctionComponent<{}> = () => {
    const {loading, data, error} = useQuery<BlocksQuery, BlocksQuery_getBlockGeometries>(query, {});

    if (error) {
        return <FatalErrorModal exception={new ApolloException(error)}/>;
    } else if (loading) {
        return <ReactLoader loaded={false}/>;
    }

    return (
        <ListGroup>
            {data!.getBlockGeometries.map(block =>
                <ListGroupItem key={block.uri}>
                    {block.geometry.label}, {block.geometry.wkt}
                </ListGroupItem>
            )}
        </ListGroup>
    );
}
