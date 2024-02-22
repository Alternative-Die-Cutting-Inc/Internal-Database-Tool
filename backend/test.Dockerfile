FROM node:18-alpine
RUN mkdir /backend
WORKDIR /backend
COPY package.json yarn.lock ./

RUN yarn install 
COPY ./ ./
CMD ["yarn", "testing"]