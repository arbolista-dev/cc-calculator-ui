mkdir ./build/production
mkdir ./build/production/assets
mkdir ./build/production/assets/font-awesome
cp -rf ./server/assets/ ./build/production/assets/
cp -rf ./node_modules/font-awesome/ ./build/production/assets/font-awesome/
mv ./build/production/assets/favicon.ico ./build/production/favicon.ico
npm run build_production

