#!/bin/bash
cd "$(dirname "$0")/../../.."
scp data/geo/loaded/tiger_line/features.ttl.bz2 twxplore:~/projects/twxplore/data/geo/loaded/tiger_line
scp data/geo/loaded/reverse_beacon/features.ttl.bz2 twxplore:~/projects/twxplore/data/geo/loaded/reverse_beacon
scp data/geo/loaded/uls/features.ttl.bz2 twxplore:~/projects/twxplore/data/geo/loaded/uls
