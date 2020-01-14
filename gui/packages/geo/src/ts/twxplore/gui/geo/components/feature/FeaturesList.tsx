import * as React from "react";
import {ListGroup, ListGroupItem} from "reactstrap";
import {ApolloQueryWrapper} from "twxplore/gui/geo/api/ApolloQueryWrapper";
import * as query from "twxplore/gui/geo/api/queries/FeaturesQuery.graphql";
import {FeaturesQuery} from "twxplore/gui/geo/api/queries/types/FeaturesQuery";

export const FeaturesList: React.FunctionComponent<{}> = () =>
    <ApolloQueryWrapper<FeaturesQuery> query={query}>
        {({data}) =>
            <ListGroup>
                {data.features.map(feature =>
                    <ListGroupItem key={feature.uri}>
                        {feature.label}
                    </ListGroupItem>
                )}
            </ListGroup>
        }
    </ApolloQueryWrapper>

