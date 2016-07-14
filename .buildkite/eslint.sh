#!/bin/bash
set -e

echo "--- :npm: Installing npm packages"
npm install

echo "--- :eslint: Running eslint"
npm run lint --silent

echo "👌 Looks good to me!"
