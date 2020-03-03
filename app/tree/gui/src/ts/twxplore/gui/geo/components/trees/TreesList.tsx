import * as React from "react";
import { TreeCollapse } from "../TreeCollapse/TreeCollapse";
import { connect } from 'react-redux'
import { Real_State } from "../../reducers/reducers";




/*
interface TreeListProps  {
    callSetMode:Function
  }

interface ReduxProps {
    trees: ResultsQuery_getTreesBySelection_trees[]
}
*/
//type ComponentProps = TreeListProps & ReduxProps
const mapStateToProps = (state: Real_State) => (
    {
     trees: state.app.selectionData!.trees,
   }
)

type Props = ReturnType<typeof mapStateToProps>
const TreesListImpl: React.FunctionComponent <Props> = ({trees}) => {
    return (
        <div>
            {trees!.map(feature =>
                <TreeCollapse features = {feature}/>
            )}
        </div>
    );
}



export const TreesList = connect(mapStateToProps)(TreesListImpl)
