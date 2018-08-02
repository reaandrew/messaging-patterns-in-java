FROM node:alpine
ADD main.js main.js
ADD lib/ lib/
ADD package.json package.json
RUN npm install
CMD ["node", "main.js"]
