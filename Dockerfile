FROM node:11.6

WORKDIR /usr/app

COPY package.json .

run npm install --quiet

COPY . .

EXPOSE 8080

CMD [ "npm", "start" ]

