# twxplore

User interface framework for semantic applications


# Building

Build all apps:

    docker-compose build
    
# Starting

Start the apps:

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

# Development

twxplore is designed to support different user interfaces for different audiences and applications. Common code for the interfaces is gathered into libraries in `lib/ts`. [`lerna`](https://github.com/lerna/lerna) is used to manage the different interfaces' web applications as well as the common libraries.

## One-time setup

In the current directory:

    npm install
    
to install lerna, then

    npm run lerna:bootstrap
    
to link together the `packages` and install their dependencies.

## Running

All of the web applications are structured similarly. After completing the one-time setup, 

Mac/Linux/WSL:

    $ cd app/geo/gui
    $ npm start

Windows:

    $ cd lib/scala/ts
    $ npm run build-win32
    
    $ cd app/geo/gui
    $ npm run start-win32
    
####To hook up the frontend with the backend:
1. Clone the twks server and run the server
    
    ```
    cd ..
    git clone https://github.com/tetherless-world/twks.git 
    cd twks/java
    mvn jetty:run
   ```     
2. Load in data from domain model to the twks server
    
    - Navigate to the TreeCli.scala ("twxplore/cli/tree/src/main/scala/io/github/tetherlessworld/twxplore/cli/tree/TreeCli") \
    - Edit configuration run parameters (in Intellij) ```etl --csv-file-path test_treedata.csv```
    - Run the file configuration
    - To verify if the file ran properly, open up your web browser and access **twks-server:8080/assertions** 
    (it should show the RDF graph in TTL format)

3. Run your backend
    - Navigate to your twxplore project directory
    
        ```
        $ sbt
        ```
     - wait for the sbt project to compile
     
        ```
        sbt:twxplore> project treeApp
        [tree-app] $run
        ```


     
  