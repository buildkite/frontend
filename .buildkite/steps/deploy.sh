#!/bin/bash
set -euo pipefail

echo "--- :buildkite: Downloading webpack artifacts"

rm -rf "dist"
mkdir -p "dist"
buildkite-agent artifact download "dist/*" "dist/"

echo "--- :s3: Deploying frontend to $S3_URL"

aws s3 sync --region "us-east-1" --acl "public-read" --exclude="manifest.json" "dist/" "$S3_URL"

echo "--- :wastebasket: Cleaning up.."

rm -rf "tmp/verify"
mkdir -p "tmp/verify"

echo "--- :earth_asia: Downloading files from $FRONTEND_HOST"

if [ ! -f "dist/manifest.json" ]; then
  echo "❌ Couldn't find dist/manifest.json"
  exit 1
fi

# Download the files in manifest.json
for url in $(cat dist/manifest.json | jq -r '.[].js | strings, arrays[]'); do
  pushd "tmp/verify" >> /dev/null
  echo "Downloading $URL"
  curl -OsS "${FRONTENV_HOST}${URL}"
  popd >> /dev/null
done

echo "--- :mag: Verifiying the files uploaded match the downloads"

# Check that the files are the same
for f in tmp/verify/*; do
  NAME=$(basename "$f")

  DOWNLOADED=$(openssl sha1 "tmp/verify/$NAME" | sed 's/^.* //')
  LOCAL=$(openssl sha1 "dist/$NAME" | sed 's/^.* //')

  if [[ "$DOWNLOADED" == "$LOCAL" ]]; then
    echo "✅ $NAME ($DOWNLOADED)"
  else
    echo "❌ $NAME"
    echo "tmp/verify/$NAME isn't the same as dist/$NAME"
    echo "Downloaded version: $DOWNLOADED"
    echo "Local version: $LOCAL"
    exit 1
  fi
done

# If we've gotten this far, the verification was A-OK, and we should remove the
# tmp/verify folder (so it won't get uploaded as BK artifacts)
rm -rf "tmp/verify"

# Now that we've confirmed the uploads are all good, we'll upload the manifest
# (which signifies that this deploy has been successful)
MANIFEST_NAME="manifest-$BUILDKITE_COMMIT.json"

echo "--- :s3: Uploading manifest.json and renaming to $MANIFEST_NAME"

# The manifest.json file won't get uploaded to the webpack SHA1'd folder beacuse
# the name already includes the build commit which is always unique.
aws s3 cp --region "us-east-1" --acl "public-read" "dist/manifest.json" "$S3_URL$MANIFEST_NAME"
