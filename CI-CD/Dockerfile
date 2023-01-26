FROM node:16.14.2-alpine
WORKDIR ./app
ENV PATH ./app/node_modules/.bin:$PATH
COPY ["package.json", "package-lock.json", "./"]
RUN npm i
COPY . ./
ENTRYPOINT ["npm", "run", "start"]