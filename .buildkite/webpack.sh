#!/bin/bash
set -e

echo "--- :wastebasket: Cleaning up.."
rm -rf dist; rm -rf node_modules;

echo "--- :npm: Installing npm packages"
npm-cache install npm

echo "--- :webpack: Building webpack assets"
./node_modules/.bin/webpack -p --config webpack/config.js --progress --bail

echo "--- :javascript: Checking valid JS"
node --check dist/*
