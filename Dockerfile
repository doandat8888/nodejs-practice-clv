FROM node:alpine AS development

WORKDIR /app/user-mgmt

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8080

CMD [ "npm", "start" ]