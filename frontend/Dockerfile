FROM node:18-alpine as build
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY ./ ./
RUN yarn build

COPY --from=build /app/dist /var/www/beta.alternativedc.com