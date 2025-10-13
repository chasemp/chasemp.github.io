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
echo "The timeline site has been deployed to /docs"
echo "Visit https://timeline.523.life to see the changes."

