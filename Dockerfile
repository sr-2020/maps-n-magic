# builder
FROM node:12.2.0 as BUILDER_FRONTEND

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json /app/package.json
RUN npm install

COPY . /app

RUN npm run build2



FROM node:12.14.0-alpine3.10

WORKDIR /app/audio-retranslator

ENV PATH /app/audio-retranslator/node_modules/.bin:$PATH

COPY --from=BUILDER_FRONTEND /app/build /app/build

COPY audio-retranslator/package.json /app/audio-retranslator/package.json
RUN npm install

COPY audio-retranslator /app/audio-retranslator

EXPOSE 3001

CMD ["npm", "run", "start"]
