FROM node:argon

ADD . /app
WORKDIR /app
RUN npm install
RUN npm rebuild node-sass
RUN ./build_production.sh

EXPOSE 3000
CMD ["npm", "run", "prod"]
