/*
import * as React from "react";
import {ListGroup, ListGroupItem} from "reactstrap";
import * as query from "twxplore/gui/geo/api/queries/FeaturesQuery.graphql";
import {useQuery} from '@apollo/react-hooks'
import {ApolloException, FatalErrorModal} from "@tetherless-world/twxplore-base-lib";
import * as ReactLoader from "react-loader";
import {FeaturesQuery, FeaturesQueryVariables} from "twxplore/gui/geo/api/queries/types/FeaturesQuery";

export const FeaturesList: React.FunctionComponent<{}> = () => {
    const {loading, data, error} = useQuery<FeaturesQuery, FeaturesQueryVariables>(query, {
        variables: {limit: 10, offset: 0},
    });

    if (error) {
        return <FatalErrorModal exception={new ApolloException(error)}/>;
    } else if (loading) {
        return <ReactLoader loaded={false}/>;
    }

    return (
        <ListGroup>
            {data!.features.map(feature =>
                <ListGroupItem key={feature.uri}>
                    {feature.label}
                </ListGroupItem>
            )}
        </ListGroup>
    );
}
*/
