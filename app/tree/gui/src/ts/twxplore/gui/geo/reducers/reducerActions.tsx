import reducers from "./reducers"
import {ResultsQuery} from 'twxplore/gui/geo/api/queries/types/ResultsQuery.ts'
import {APP_STATE} from 'twxplore/gui/geo/reducers/reducers'


interface selectionDataAction {
  type:string
  selection_data: ResultsQuery
}

interface AppendToMap{
  type:string
  map: string
  uri: string
}

type Action= selectionDataAction | AppendToMap

const composedReducer = (state: APP_STATE, action: Action) => {
  switch (action.type) {
    case 'appendToMap': {
      state.app[action.map].set(action.uri, action.uri)
      let result = state
      return {
        ...result
        }
    }
    case 'sendSelectionData' : {
      const result = Object.assign({}, state)
      result.app.selectionData = action.selection_data
      return{
        ...result
      }

    }
  };
  return reducers(state, action);
 };

 export default composedReducer