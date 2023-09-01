FROM node:18-alpine as build
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY ./ ./
RUN yarn build

FROM alpine

COPY --from=build /app/dist /app/dist
