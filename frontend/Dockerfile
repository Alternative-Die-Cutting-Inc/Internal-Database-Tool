FROM node:18-alpine as build
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY ./ ./

RUN yarn build

FROM alpine:3.14

COPY --from=build /app/dist /app/dist
