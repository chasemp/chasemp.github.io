#!/bin/bash

# Deploy script for Jekyll to Astro conversion
# This script builds the Astro site and deploys it to the root directory

set -e

echo "🚀 Building Astro site..."
cd astro
npm run build

echo "📦 Deploying to root directory..."
cd ..
cp astro/dist/index.html index.html
cp -r astro/dist/assets .
cp astro/dist/CNAME .

echo "✅ Deployment complete!"
echo "The site should now show the timeline instead of the old Jekyll content."
echo "Visit https://blog.523.life to see the changes."

