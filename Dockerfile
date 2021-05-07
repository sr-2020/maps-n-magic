# builder
FROM node:12.2.0 as BUILDER_FRONTEND

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json /app/package.json
COPY lerna.json /app/lerna.json

COPY ./packages /app/packages

RUN npm i -g lerna
RUN npm i
RUN npm run bootstrap
RUN npm run install-local-deps
RUN npm run bootstrap

COPY .env.example /app/packages/sr2020-mm-track-analysis/.env
COPY .env.example /app/packages/sr2020-mm-client/.env
COPY ./packages/sr2020-mm-server/.env.example /app/packages/sr2020-mm-server/.env

COPY tsconfig.json /app/tsconfig.json

RUN npm run build-and-deploy

CMD ["npm", "run", "start:server"]


#FROM node:12.14.0-alpine3.10
#
#WORKDIR /app
#
#ENV PATH /app/node_modules/.bin:$PATH
#
#COPY --from=BUILDER_FRONTEND /app/build /app/build
#
#COPY audio-retranslator/package.json /app/audio-retranslator/package.json
#RUN npm install
#
#COPY audio-retranslator /app/audio-retranslator
#
#EXPOSE 3001
#
#CMD ["npm", "run", "start"]
