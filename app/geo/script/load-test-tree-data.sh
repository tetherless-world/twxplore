#!/bin/bash
cd "$(dirname "$0")/../../.."
ROOT_DIR=`realpath $PWD`
cd lib/scala/tree/src/test/resources
java -jar $ROOT_DIR/cli/tree/dist/tree-cli.jar etl
