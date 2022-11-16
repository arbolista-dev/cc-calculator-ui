rm -r ./build &&\
  mkdir -p ./build/production/assets/font-awesome &&\
  cp -rf ./server/assets/* ./build/production/assets/ &&\
  cp ./server/views/index.html ./build/production
exit 1 # this doesn't work and must be run manually from command line.
  cp -rf ./node_modules/font-awesome/ ./build/production/assets/font-awesome &&\
  mv ./build/production/assets/favicon.ico ./build/production/favicon.ico &&\
  npm run build_production
