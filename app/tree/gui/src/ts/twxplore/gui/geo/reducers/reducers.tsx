// Copyright (c) 2018 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';
import {routerReducer} from 'react-router-redux';
import keplerGlReducer from 'kepler.gl/reducers';
import {ActionTypes} from 'kepler.gl/actions';

// INITIAL_APP_STATE
type INITIAL_APP_STATE = {
  info: any,
  loaded: Boolean,
  blocks: Array<String>[],
  NTAs: Array<String>[],
  scope: String,
  parentUri: String,
  createSelection: Boolean
}

const initialAppState: INITIAL_APP_STATE= {
  info: {},
  loaded: false,
  blocks: [],
  NTAs: [],
  scope: "borough",
  parentUri: "",
  createSelection: false
};



const reducers = combineReducers({
  // mount keplerGl reducer
  keplerGl: keplerGlReducer,
  app: handleActions({
    [ActionTypes.LAYER_CLICK]: (state, action) => {
      switch(action.payload.info.picked) {
        case true: {
          console.log(action.payload)
          var result = {}
          switch(action.payload.info.object.properties.type) {
            case "block": {
              alert("in Block!")
              state.blocks.push(action.payload.info.object.properties.uri)
              result = {
                blocks: state.blocks,
                createSelection: true
              }
              console.log(result)
              break;
            }
            case "NTA": {
              // result = {
              //   NTAs: state.NTAs += action.payload.info.object.properties.uri
              // }
              break;
            }
          }
          return ({
            ...state,
            ...result,
            scope: action.payload.info.object.properties.child,
            parentUri: action.payload.info.object.properties.uri
          })
        }
        default: {
          return ({
            ...state
          })
        }
      }
    },
  }, initialAppState),
  routing: routerReducer
});

export default reducers;
