FROM node:20-alpine as build

WORKDIR /opt/app

ADD *.json ./

RUN npm ci 

COPY . .

RUN npm run build api


FROM node:20-alpine

WORKDIR /opt/app

ADD *.json ./

RUN npm ci --omit=dev

COPY --from=build /opt/app/dist/apps/api ./dist

CMD ["node", "./dist/main.js"]