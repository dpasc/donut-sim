#!/bin/bash
set -e

echo "Building the app..."
npm run build

echo "Deploying to S3 bucket: donut-sim"
aws s3 sync build/ s3://donut-sim --delete

echo "Deployment complete!"
echo "Site is live at: http://donut-sim.s3-website-ap-southeast-2.amazonaws.com"
