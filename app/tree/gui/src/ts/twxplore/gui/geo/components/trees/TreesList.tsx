import * as React from "react";
import * as query from "twxplore/gui/geo/api/queries/TreesQuery.graphql";
import { TreeCollapse } from "../TreeCollapse/TreeCollapse";
import { connect } from 'react-redux'
import { ResultsQuery_getTreesBySelection_trees } from 'twxplore/gui/geo/api/queries/types/ResultsQuery.ts'
import { Real_State, APP_STATE } from "../../reducers/reducers";




interface TreeListProps  {
    callSetMode:Function
  }

interface ReduxProps {
    trees: ResultsQuery_getTreesBySelection_trees[]
}

type ComponentProps = TreeListProps & ReduxProps
  
export const TreesList: React.FunctionComponent<ComponentProps> = ({callSetMode, trees}) => {
    return (
        <div>
            {trees.map(feature =>
                <TreeCollapse features = {feature} callSetMode = {callSetMode}/>
            )}
        </div>
    );
}


const mapStateToProps = (state: Real_State) => (
     {
      trees: state.app.selectionData
    }
)

export default connect<TreeListProps, ReduxProps>(mapStateToProps)(TreesList)
