FROM node:18-alpine

WORKDIR /app

# Set the timezone environment variable
ENV TZ=Asia/Tehran
COPY package.json yarn.lock ./
RUN yarn
COPY next.config.js ./next.config.js

CMD ["yarn", "dev"]