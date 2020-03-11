#!/bin/bash
cd "$(dirname "$0")/../../.."
java -jar ../twks/java/dist/twks-cli-current.jar put-nanopublications \
  data/geo/loaded/tiger_line/features.ttl.bz2 \
  data/geo/loaded/reverse_beacon/features.ttl.bz2
