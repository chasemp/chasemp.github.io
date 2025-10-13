#!/bin/bash

# Deploy script for Jekyll to Astro conversion
# This script builds the Astro site and deploys it to the root directory

set -e

echo "🚀 Building Astro site..."
cd astro
npm run build

echo "📦 Deploying to docs directory..."
cd ..
mkdir -p docs
cp astro/dist/index.html docs/index.html
cp -r astro/dist/assets docs/
cp astro/dist/CNAME docs/

echo "✅ Deployment complete!"
echo "The site should now show the timeline instead of the old Jekyll content."
echo "Visit https://blog.523.life to see the changes."

