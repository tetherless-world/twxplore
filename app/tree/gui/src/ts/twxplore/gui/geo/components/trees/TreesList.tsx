import * as React from "react";
import * as query from "twxplore/gui/geo/api/queries/TreesQuery.graphql";
import {useQuery} from '@apollo/react-hooks'
import {ApolloException, FatalErrorModal} from "@tetherless-world/twxplore-base-lib";
import * as ReactLoader from "react-loader";
import {TreesQuery, TreesQuery_trees} from "twxplore/gui/geo/api/queries/types/TreesQuery";
import { TreeCollapse } from "../TreeCollapse/TreeCollapse";



type TreeListProps = {
    callSetMode:Function
  }

export const TreesList: React.FunctionComponent<TreeListProps> = ({callSetMode}) => {
    const {loading, data, error} = useQuery<TreesQuery, TreesQuery_trees>(query, {});

    if (error) {
        return <FatalErrorModal exception={new ApolloException(error)}/>;
    } else if (loading) {
        return <ReactLoader loaded={false}/>;
    }

    return (
        <div>
            {data!.trees.map(feature =>
                <TreeCollapse features = {feature} callSetMode = {callSetMode}/>
            )}
        </div>
    );
}


//<TreeCollapse uri={feature.uri} longitude={feature.longitude} 
//latitude={feature.latitude}/>
export default TreesList