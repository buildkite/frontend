#!/bin/bash

# This script executes "flow" in an environment where
# the files it's running have been preprocessed by Babel

# This is an aw{ful,esome} hack.

FILES=""

# Grab any file arguments given, as we will pipe these
# directly through with Babel
for ARG in "$@"; do
  if [[ -f "$ARG" ]]; then
    FILES="$FILES $ARG"
  fi
done

BABEL_ARGS="--no-babelrc --plugins=syntax-jsx,syntax-async-functions,syntax-async-generators,syntax-class-constructor-call,syntax-class-properties,syntax-decorators,syntax-do-expressions,syntax-dynamic-import,syntax-exponentiation-operator,syntax-export-extensions,syntax-flow,syntax-object-rest-spread,syntax-trailing-function-commas,syntax-flow,transform-function-bind"

# If we got any file args, 
if [[ -z "$FILES" ]]; then
  mkdir -p .flow/app
  cp .flowconfig .flow
  $(yarn bin)/babel $BABEL_ARGS app -d .flow/app >&2
  (cd .flow && $(yarn bin)/flow $@)
  rm -rf .flow
else
  $(yarn bin)/babel $BABEL_ARGS $FILES | $(yarn bin)/flow $@
fi
