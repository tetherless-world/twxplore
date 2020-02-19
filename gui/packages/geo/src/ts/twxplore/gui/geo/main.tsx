import 'twxplore/gui/geo/custom_bootstrap.scss';

// import {apolloClient} from "twxplore/gui/geo/api/apolloClient";
import {createBrowserHistory} from 'history';
import {NoRoute} from 'twxplore/gui/geo/components/error/NoRoute';
import {Home} from 'twxplore/gui/geo/components/home/Home';
import KeplerMap from 'twxplore/gui/geo/components/map/Map'
import {Hrefs} from 'twxplore/gui/geo/Hrefs';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
// import {ApolloProvider} from "react-apollo";
// import {ApolloProvider as ApolloHooksProvider} from "@apollo/react-hooks";
import {Route, Router, Switch} from 'react-router';
import {ConsoleLogger, LoggerContext} from 'twxplore-gui-lib';
import { Provider } from 'react-redux'
import store from './store'
require('dotenv').config()

const logger = new ConsoleLogger();

// Stores
const browserHistory = createBrowserHistory();

ReactDOM.render(
    // <ApolloProvider client={apolloClient}>
    //   <ApolloHooksProvider client={apolloClient}>
    //     <LoggerContext.Provider value={logger}>
    //       <Router history={browserHistory}>
    //           <Switch>
    //               <Route exact path={Hrefs.home} component={Home}/>
    //               <Route exact path = {Hrefs.map} component={Map}/>
    //               <Route component={NoRoute}/>
    //           </Switch>
    //       </Router>
    //     </LoggerContext.Provider>
    //   </ApolloHooksProvider>
    // </ApolloProvider>,
        <Provider store={store}>
          <LoggerContext.Provider value={logger}>
          <Router history={browserHistory}>
              <Switch>
                  <Route exact path={Hrefs.home} component={Home}/>
                  <Route exact path = {Hrefs.map} component={KeplerMap}/>
                  <Route component={NoRoute}/>
              </Switch>
          </Router>
        </LoggerContext.Provider>
        </Provider>,
    document.getElementById('root')
);