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
import {routerReducer, RouterState} from 'react-router-redux';
import keplerGlReducer from 'kepler.gl/reducers';
import { TreeMapQuery_TreesBySelection } from 'twxplore/gui/geo/api/queries/types/TreeMapQuery'
import {composedReducer} from 'twxplore/gui/geo/reducers/reducerActions.tsx'

// INITIAL_APP_STATE
export interface APP_STATE  {
  info: any,
  loaded: Boolean,
  blockMap: Map<String, String>,
  ntaMap: Map<String, String>,
  boroughMap: Map<String, String>,
  blocks: Array<String>[],
  NTAs: Array<String>[],
  scope: String,
  parentUri: String,
  createSelection: Boolean,
  selectionData: TreeMapQuery_TreesBySelection | null
  mode:string
}

export type Real_State = {
  keplerGl: any
  app: APP_STATE
  routing: RouterState
}

export const initialAppState: APP_STATE= {
  info: {},
  loaded: false,
  blockMap: new Map(),
  ntaMap: new Map(),
  boroughMap: new Map(),
  blocks: [],
  NTAs: [],
  scope: "borough",
  parentUri: "",
  createSelection: false,
  selectionData: null,
  mode: "home"
};




export const reducers = combineReducers({
  // mount keplerGl reducer
  keplerGl: keplerGlReducer,
  app: composedReducer,
  routing: routerReducer
});

export default reducers;

