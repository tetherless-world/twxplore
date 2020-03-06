# Scripts

The scripts in this directory follow the pattern of [Scripts to Rule Them All](https://github.com/github/scripts-to-rule-them-all).

The `server` script starts three different servers:
1. A TWKS database server. This script assumes TWKS is checked out as a sibling of the current checkout.
2. The app's back end server in Scala.
3. The app's front end server in webpack.

The servers can be started separately.

## Loading data

Use the script `load-test-tree-data` to populate a local TWKS instance with test data.
