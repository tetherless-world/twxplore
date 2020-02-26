import reducers from "./reducers"


const composedReducer = (state, action) => {
  switch (action.type) {
    case 'nah':
      alert("you clicked me man!")
      return {
        ...state,
        }
      };
  return reducers(state, action);
 };

 export default composedReducer