#!/bin/bash

# Script to download all media files for IRD Clone
# Navigate to the media directory and run this script

echo "Downloading IRD Nepal website images..."

# Download IRD Logo
echo "1. Downloading IRD Logo..."
curl -o ird-logo.png https://ird.gov.np/public/images/1168015708.png

# Download Modal Image
echo "2. Downloading Modal Image..."
curl -o modal-image.jpg https://ird.gov.np/public/images/869883628.jpg

# Download Slider Banner
echo "3. Downloading Slider Banner..."
curl -o ird-app-banner.jpg https://ird.gov.np/public/images/1397622153.jpg

# Download Director Photo
echo "4. Downloading Director Photo..."
curl -o basudev-poudel.jpg https://ird.gov.np/public/images/1311898185.JPG

echo ""
echo "✓ All images downloaded successfully!"
echo "Files saved in: $(pwd)"
