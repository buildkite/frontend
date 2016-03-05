#!/bin/bash
set -e

echo "--- :wastebasket: Cleaning up.."
rm -rf dist; rm -rf node_modules;

echo "--- :npm: Installing npm packages"
npm-cache install npm
