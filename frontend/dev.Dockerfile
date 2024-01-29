FROM node:18-alpine
RUN mkdir /frontend
WORKDIR /frontend
COPY package.json yarn.lock ./

RUN yarn install 
COPY ./ ./
CMD ["yarn", "dev"]