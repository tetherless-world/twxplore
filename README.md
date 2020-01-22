# twxplore

User interface framework for semantic applications


# Building

Build all services and GUIs:

    docker-compose build
    
# Starting

Start the geo service and GUI:

    docker-compose up

Start TWKS only:
    
    docker-compose up twks-server

# Loading data

After starting (possibly TWKS only), you can load data from various sources.

## Dynamic Spectrum Access (DSA) policy and location data

The script `devbin/load-dsa-data.sh` loads data from the DSA project. In order to run you must

1. Check out twks as a sibling of the current checkout e.g., `~/projects/twks` and `~/projects/twxplore`.
1. Build twks: `cd ~/projects/twks/java && mvn package -Dmaven.test.skip`
1. Check out the private DSA repository as a sibling of the current checkout named `dsa_whyis` e.g., ~/projects/dsa_whyis`
1. If running locally instead of in a Docker container, map `twks-server` to `localhost`
1. Run the `devbin/load-dsa-data.sh` script


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

### Building the library

The library package is configured to use the library's `dist` rather than its `src`, which means it needs to be built before first use and whenever it's changed.

    cd packages/lib
    npm run build

## Running

All of the web applications are structured similarly. After completing the one-time setup, 

    cd packages/geo
    npm start
