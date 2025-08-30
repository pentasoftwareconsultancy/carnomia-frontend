#!/bin/bash
echo "🔨 Building the project..."
npm run build

echo "🧹 Cleaning old deployment folder..."
rm -rf /var/www/drivesta-frontend/*

echo "📦 Copying new build files..."
cp -r dist/* /var/www/drivesta-frontend/

echo "🔐 Fixing permissions..."
chown -R www-data:www-data /var/www/drivesta-frontend
chmod -R 755 /var/www/drivesta-frontend

echo "✅ Deployment complete!"