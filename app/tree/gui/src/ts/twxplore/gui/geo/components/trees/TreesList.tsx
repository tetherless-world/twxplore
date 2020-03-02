import * as React from "react";
import * as query from "twxplore/gui/geo/api/queries/TreesQuery.graphql";
import {useQuery} from '@apollo/react-hooks'
import {ApolloException, FatalErrorModal} from "@tetherless-world/twxplore-base-lib";
import * as ReactLoader from "react-loader";
import {TreesQuery, TreesQuery_trees} from "twxplore/gui/geo/api/queries/types/TreesQuery";
import { TreeCollapse } from "../TreeCollapse/TreeCollapse";
import { connect } from 'react-redux'
import { ResultsQuery_getTreesBySelection_trees } from 'twxplore/gui/geo/api/queries/types/ResultsQuery.ts'



interface TreeListProps  {
    callSetMode:Function
  }

interface ReduxProps {
    trees: ResultsQuery_getTreesBySelection_trees[]
}

type ComponentProps = TreeListProps & ReduxProps
  
export const TreesList: React.FunctionComponent<ComponentProps> = ({callSetMode, trees}) => {
    const {loading, data, error} = useQuery<TreesQuery, TreesQuery_trees>(query, {});

    if (error) {
        return <FatalErrorModal exception={new ApolloException(error)}/>;
    } else if (loading) {
        return <ReactLoader loaded={false}/>;
    }
    //data!.trees.
    return (
        <div>
            {trees.map(feature =>
                <TreeCollapse features = {feature} callSetMode = {callSetMode}/>
            )}
        </div>
    );
}


const mapStateToProps = (state) => (
     {
      trees: state.app.selectionData.trees
    }
)

export default connect<TreeListProps, ReduxProps>(mapStateToProps)(TreesList)
