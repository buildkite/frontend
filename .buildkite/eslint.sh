#!/bin/bash
set -e

echo "--- Installing :npm: packages"
rm -rf node_modules
npm-cache install npm

echo "--- Running eslint :eslint:"
npm run lint --silent
