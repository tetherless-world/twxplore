#!/bin/bash
cd "$(dirname "$0")"
DSA_DIR=$PWD/../../dsa_whyis
TWKS_DIR=$PWD/../../twks

java -Dtwks.serverBaseUrl=http://twks-server:8080 -jar $TWKS_DIR/java/dist/twks-cli-current.jar \
  put-nanopublications \
      $DSA_DIR/ontologies/prov-o.ttl \
      $DSA_DIR/ontologies/sio-subset-labels.owl \
      $DSA_DIR/ontologies/geosparql_vocab_all_v1_0_1_updated.rdf \
      $DSA_DIR/data/mil.ttl.gz \
      $DSA_DIR/data/state.ttl.gz \
      $DSA_DIR/ontologies/dsa-t.ttl \
      $DSA_DIR/ontologies/dsa-g.ttl \
      $DSA_DIR/ontologies/dsa-owl.ttl \
      $DSA_DIR/ontologies/dsa_lgs-rpi_v2b.ttl
