# twxplore

User interface framework for semantic applications

# Building and running apps in Docker

## Building

Build all apps:

    docker-compose build
    
# Starting

Start the apps:

    docker-compose up

Start TWKS only:
    
    docker-compose up twks-server

# Building and running apps outside of Docker

Every app has a `script` directory with scripts that follow the [Scripts to Rule Them All](https://github.com/github/scripts-to-rule-them-all) patterns for building and running the app. See e.g., `app/tree/script`.

The scripts assume you have checked out [TWKS](https://github.com/tetherless-world/twks) as a sibling of the current checkout e.g., `~/projects/twks` and `~/projects/twxplore`.

# Development

twxplore is designed to support different user interfaces for different audiences and applications. Common code for the interfaces is gathered into libraries in `lib/ts`. [`lerna`](https://github.com/lerna/lerna) is used to manage the different interfaces' web applications as well as the common libraries.
