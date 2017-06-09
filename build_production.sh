rm -r ./build
mkdir -p ./build/production/assets/font-awesome
cp -rf ./server/assets/* ./build/production/assets/
cp ./server/views/index.ejs ./build/production/index.html
cp -rf ./node_modules/font-awesome/ ./build/production/assets/
mv ./build/production/assets/favicon.ico ./build/production/favicon.ico
npm run build_production
