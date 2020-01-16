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
1. Run the `devbin/load-dsa-data.sh` script
