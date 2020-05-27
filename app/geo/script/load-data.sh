#!/bin/bash
cd "$(dirname "$0")/../../.."
java -Dtwks.clientReadTimeoutMs=120000 -jar ../twks/java/dist/twks-cli-current.jar put-nanopublications \
  data/geo/loaded/dsa/features.ttl.bz2 \
  data/geo/loaded/osn/features.ttl.bz2 \
  data/geo/loaded/tiger_line/features.ttl.bz2 \
  data/geo/loaded/reverse_beacon/features.ttl.bz2 \
  data/geo/loaded/uls/features.ttl.bz2 \
