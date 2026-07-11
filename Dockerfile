FROM node:20-alpine as build

WORKDIR /opt/app

ADD *.json ./

RUN npm ci 

COPY . .

RUN npm run build


FROM node:20-alpine as runner

WORKDIR /opt/app

ADD *.json ./

RUN npm ci --omit=dev

COPY --from=build /opt/app/.next ./.next
COPY --from=build /opt/app/public ./public
COPY --from=build /opt/app/next.config.ts ./next.config.ts

CMD ["node", "./dist/main.js"]