FROM node:8.10

WORKDIR /usr/app

COPY package.json .

run npm install --quiet

COPY . .

EXPOSE 8080

CMD [ "npm", "start" ]

