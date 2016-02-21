#!/bin/bash
set -e

echo "--- :wastebasket: Cleaning up.."
rm -rf dist; rm -rf node_modules;

echo "--- Installing :npm: packages"
npm-cache install npm

echo "--- Running eslint :eslint:"
npm run lint --silent
