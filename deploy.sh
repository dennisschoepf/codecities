#!/bin/sh

echo "Building project ..."
npm run build
echo "Project build done!"
echo "-------------------"

echo "Removing existing folder on remote"
ssh root@202.61.225.50 rm -rf /var/www/codewanderer
echo "Folder on remote removed!"
echo "-------------------"

echo "Uploading new project state"
scp -r dist root@202.61.225.50:/var/www/codewanderer
echo "Upload complete!"