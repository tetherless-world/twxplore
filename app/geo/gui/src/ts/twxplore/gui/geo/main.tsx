import {createBrowserHistory} from "history";
import * as React from "react";
import * as ReactDOM from "react-dom";
import {ApolloProvider} from "react-apollo";
import {ApolloProvider as ApolloHooksProvider} from "@apollo/react-hooks";
import {Route, Router, Switch} from "react-router";
import {ConsoleLogger, LoggerContext} from "@tetherless-world/twxplore-base";
import {Provider} from "react-redux";
import store from "./store";
import {SelectionHome} from "./components/SelectionHome/SelectionHome";
import {Map} from "./components/map/Map";
import {Hrefs} from "./Hrefs";
import {apolloClient} from "./api/apolloClient";
import {NoRoute} from "./components/error/NoRoute";

// Logger
const logger = new ConsoleLogger();

// Stores
const browserHistory = createBrowserHistory();

ReactDOM.render(
  <ApolloProvider client={apolloClient}>
    <ApolloHooksProvider client={apolloClient}>
      <Provider store={store}>
        <LoggerContext.Provider value={logger}>
          <Router history={browserHistory}>
            <Switch>
              <Route exact path={Hrefs.home} component={Map} />
              <Route exact path={Hrefs.map} component={Map} />
              <Route exact path={Hrefs.selection} component={SelectionHome} />
              <Route component={NoRoute} />
            </Switch>
          </Router>
        </LoggerContext.Provider>
      </Provider>
    </ApolloHooksProvider>
  </ApolloProvider>,
  document.getElementById("root")
);
