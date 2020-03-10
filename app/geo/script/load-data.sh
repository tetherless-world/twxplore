#!/bin/bash
cd "$(dirname "$0")/../../.."
java -jar ../twks/java/dist/twks-cli-current.jar put-nanopublications data/geo/features.ttl.bz2
