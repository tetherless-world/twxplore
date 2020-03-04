import * as React from "react";
import {TreeCollapse} from "../TreeCollapse/TreeCollapse";
import {connect} from 'react-redux'
import {RootState} from "twxplore/gui/tree/reducers/RootState";


/*
interface TreeListProps  {
    callSetMode:Function
  }

interface ReduxProps {
    trees: ResultsQuery_getTreesBySelection_trees[]
}
*/
//type ComponentProps = TreeListProps & ReduxProps
const mapStateToProps = (state: RootState) => (
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
