FROM node:20.18.3-alpine

EXPOSE 4000
WORKDIR /usr/app
COPY ./package.json ./
RUN npm install
COPY ./ ./
CMD ["npm", "run" , "start"]
