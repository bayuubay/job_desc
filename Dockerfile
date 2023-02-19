FROM node:16-alpine
WORKDIR /app
COPY ./wait-for .
RUN apk add --no-cache nano
RUN yarn global add pm2 sequelize-cli
RUN chmod +x ./wait-for
COPY ./package.json .
RUN yarn install
COPY . .