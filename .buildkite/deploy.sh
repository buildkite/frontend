#!/bin/bash
set -e

echo "--- :buildkite: Downloading webpack artifacts"

rm -rf "dist"
mkdir -p "dist"
buildkite-agent artifact download "dist/*" "dist/"

echo "--- :s3: Deploying frontend to $DIST_S3_URL"

s3cmd put -P --recursive --verbose --force --no-preserve "dist/" "$DIST_S3_URL"

echo "--- :wastebasket: Cleaning up.."

rm -rf "tmp/verify"
mkdir -p "tmp/verify"

echo "--- :earth_asia: Downloading files from $FRONTEND_HOST"

if [ ! -f "dist/manifest.json" ]; then
  echo "❌ Couldn't find dist/manifest.json"
  exit 1
fi

# Download the files in manifest.json
for url in $(cat dist/manifest.json | jq -r '.[].js'); do
  # Make sure the URL is prefixed with https (if it's just got //)
  URL=$(echo $url | sed -e 's/^\/\//https:\/\//')

  pushd "tmp/verify" >> /dev/null
  echo "Downloading $URL"
  curl -OsS "$URL"
  popd >> /dev/null
done

echo "--- :mag: Verifiying the files uploaded match the downloads"

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

echo "--- :s3: Deploying manifests to $MANIFEST_S3_URL$BUILDKITE_COMMIT"

s3cmd put -P --recursive --verbose --force --no-preserve "dist/manifest.json" "$MANIFEST_S3_URL$BUILDKITE_COMMIT/"
