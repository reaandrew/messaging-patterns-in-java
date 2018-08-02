FROM node:alpine
ADD package.json package.json
RUN npm install
ADD server.js server.js
CMD ["npm", "start"]
