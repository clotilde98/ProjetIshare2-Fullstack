FROM node:21

WORKDIR /usr/src/app

COPY package*.json ./


RUN npm install


COPY . .

EXPOSE 3002
EXPOSE 443

CMD ["npm", "run", "dev"]