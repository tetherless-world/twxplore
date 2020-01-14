# twxplore Graphical User Interface (GUI) implementations

twxplore is designed to support different user interfaces for different audiences and applications. Common code for the interfaces is
gathered into a `lib`. [`lerna`](https://github.com/lerna/lerna) is used to manage the different interfaces' web applications as well as the common `lib`.

The `lerna` `packages` are currently:

* `geo`: a web application for working with geospatial data, packaged with `webpack` and paired with the `geo-service`
*  `lib`: `twxplore-gui-lib` library of common code between the interfaces, not usable standalone

## One-time setup

In the current directory:

    npm install
    
to install lerna, then

    npm run lerna:bootstrap
    
to link together the `packages` and install their dependencies.

## Running

All of the web applications are structured similarly. After completing the one-time setup, 

    cd packages/geo
    npm start
