import * as React from "react";
import {ListGroup, ListGroupItem} from "reactstrap";
import * as query from "twxplore/gui/geo/api/queries/TreesQuery.graphql";
import {useQuery} from '@apollo/react-hooks'
import {ApolloException, FatalErrorModal} from "@tetherless-world/twxplore-base-lib";
import * as ReactLoader from "react-loader";
import {TreesQuery, TreesQuery_trees} from "twxplore/gui/geo/api/queries/types/TreesQuery";

export const TreesList: React.FunctionComponent<{}> = () => {
    const {loading, data, error} = useQuery<TreesQuery, TreesQuery_trees>(query, {});

    if (error) {
        return <FatalErrorModal exception={new ApolloException(error)}/>;
    } else if (loading) {
        return <ReactLoader loaded={false}/>;
    }

    return (
        <ListGroup>
            {data!.trees.map(feature =>
                <ListGroupItem key={feature.uri}>
                    {feature.latitude}, {feature.longitude}
                </ListGroupItem>
            )}
        </ListGroup>
    );
}
