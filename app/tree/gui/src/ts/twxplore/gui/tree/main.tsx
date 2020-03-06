import "twxplore/gui/tree/custom_bootstrap.scss";
import {apolloClient} from "twxplore/gui/tree/api/apolloClient";
import {createBrowserHistory} from "history";
import {NoRoute} from "twxplore/gui/tree/components/error/NoRoute";
import {Home} from "twxplore/gui/tree/components/home/Home";
import {SelectionHome} from "twxplore/gui/tree/components/SelectionHome/SelectionHome";
import {Hrefs} from "twxplore/gui/tree/Hrefs";
import {Map} from "twxplore/gui/tree/components/map/Map";
import * as React from "react";
import * as ReactDOM from "react-dom";
import {ApolloProvider} from "react-apollo";
import {ApolloProvider as ApolloHooksProvider} from "@apollo/react-hooks";
import {Route, Router, Switch} from "react-router";
import {
  ConsoleLogger,
  LoggerContext,
} from "@tetherless-world/twxplore-base-lib";
import {Provider} from "react-redux";
import store from "./store";

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
              <Route exact path={Hrefs.home} component={Home} />
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
