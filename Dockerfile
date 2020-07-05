FROM node:12.18.0-stretch

WORKDIR /app/

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "npm", "start" ]
