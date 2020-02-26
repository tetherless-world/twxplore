import * as React from "react";



//type BoroughListProps = {
//  }

export const BoroughList: React.FunctionComponent<{}> = () => {
    /* const {loading, data, error} = useQuery<TreesQuery, TreesQuery_trees>(query, {});

    if (error) {
        return <FatalErrorModal exception={new ApolloException(error)}/>;
    } else if (loading) {
        return <ReactLoader loaded={false}/>;
    } */

    return ( <div>
                <p>You entered borough mode!</p>
            </div>
    );
}

/* <div>
            {data!.trees.map(feature =>
                <TreeCollapse features= {feature} callSetMode = {callSetMode}/>
            )}
        </div> */

//<TreeCollapse uri={feature.uri} longitude={feature.longitude} 
//latitude={feature.latitude}/>
export const BoroughList