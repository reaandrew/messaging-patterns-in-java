FROM node:alpine
ADD package.json package.json
RUN npm install
ADD main.js main.js
CMD ["node", "main.js"]
