FROM node:20-alpine as build

WORKDIR /app

COPY *.json ./

RUN npm ci 

ARG NEXT_PUBLIC_YANDEX_METRIKA_ID
ENV NEXT_PUBLIC_YANDEX_METRIKA_ID=$NEXT_PUBLIC_YANDEX_METRIKA_ID

COPY . .

RUN npm run build


FROM node:20-alpine as runner

WORKDIR /app

COPY *.json ./

RUN npm ci --omit=dev

COPY --from=build /app/public ./public
COPY --from=build /app/.next/static ./.next/static

# 2. Копируем саму standalone сборку (включая server.js) напрямую в корень /app
COPY --from=build /app/.next/standalone ./

EXPOSE 3000

CMD ["node", "server.js"]