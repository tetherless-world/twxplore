#!/bin/bash
cd "$(dirname "$0")/../../.."
java -jar ../twks/java/cli/dist/twks-cli put-nanopublications data/geo/features.ttl.gz
