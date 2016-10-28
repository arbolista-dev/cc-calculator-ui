FROM node:boron

ADD . /app
WORKDIR /app
RUN npm install --production
RUN npm rebuild node-sass
RUN ./build_production.sh

EXPOSE 3000
CMD ["npm", "run", "prod"]
