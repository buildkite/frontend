#!/bin/bash
set -euo pipefail

# Start with a clean slate
rm -rf "tmp/verify"
mkdir -p "tmp/verify"

echo "--- :earth_asia: Downloading..."

# Download the files in assets.json
for url in $(cat dist/assets.json | jq -r '.[].js'); do
  # Make sure the URL is prefixed with https (if it's just got //)
  URL=$(echo $url | sed -e 's/^\/\//https:\/\//')

  pushd "tmp/verify" >> /dev/null
  echo "Downloading $URL"
  curl -OsS "$URL"
  popd >> /dev/null
done

echo "--- :mag: Verifiying..."

# Check that the files are the same
for f in tmp/verify/*; do
  NAME=$(basename $f)

  DOWNLOADED=$(openssl md5 "tmp/verify/$NAME" | sed 's/^.* //')
  LOCAL=$(openssl md5 "dist/$NAME" | sed 's/^.* //')

  if [[ "$DOWNLOADED" == "$LOCAL" ]]; then
    echo "✅  $NAME"
  else
    echo "❌  $NAME"
    echo "tmp/verify/$NAME isn't the same as dist/$NAME"
    echo "Downloaded version: $DOWNLOADED"
    echo "Local version: $LOCAL"
    exit 1
  fi
done
