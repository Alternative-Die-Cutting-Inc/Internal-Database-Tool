FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --include-dev

COPY ./ ./

CMD ["yarn", "test"]