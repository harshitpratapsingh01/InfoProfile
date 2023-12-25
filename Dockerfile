FROM node:18.16.1-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install && npm install typescript -g && npm install pm2 -g
COPY . .
RUN tsc
RUN apk add curl
EXPOSE 4010
#CMD ["pm2-runtime", "start" , "pm2.config.js"]
#test
#CMD NODE_ENV=local node ./build/server.js
ENV NODE_ENV=development
CMD ["pm2-runtime", "start" , "./build/server.js","--name=harshitapp"]