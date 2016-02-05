#!/bin/bash

echo "--- Installing :npm: packages"
rm -rf node_modules
npm-cache install npm

echo "--- Running eslint :eslint:"
./node_modules/eslint/bin/eslint.js
