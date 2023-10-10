FROM node:16-slim

WORKDIR /app

COPY package.json /app/package.json

RUN npm install

COPY . /app

RUN npm run build

EXPOSE 4000
CMD ["npm", "start"]