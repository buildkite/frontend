#!/bin/bash
set -e

echo "--- :eslint: Running eslint"
npm run lint --silent

echo "👌 Looks good to me!"
